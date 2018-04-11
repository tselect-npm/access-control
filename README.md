# AccessControl

Simple, flexible and reliable [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) / [ABAC](https://en.wikipedia.org/wiki/Attribute-based_access_control) access control for NodeJS and Typescript.

## Requirements
- `node >= 7`
- `typescript >= 2.4`

## Installation

`npm i @bluejay/access-control`

## Guide

### Simple role based access control

Many applications define a list of roles which are assigned to users and thus define what those users can or cannot do. This is called RBAC (Role Based Access Control) and is one of the most used access control mechanism. Below we'll take a look at how this can be implemented with Bluejay's AccessControl.


First, let's define some application context:

```typescript
// Here we define 2 roles: one for regular customers, and a special admin role for internal users.
// Note that Bluejay's AccessControl doesn't require any specific role values nor the use of an enum. A role in Bluejay's world is as simple as a string.
export enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

// This interface describes the attributes of the "post" entity, which represents blog posts in our example application.
export interface IPost {
  id: integer;
  title: string;
  content: string;
  created_by: integer;
  created_at: Date;
  updated_at: Date;
}
```

Next, we'll define a `Subject` class to hold our user's information and communicate with Bluejay's AccessControl. A *subject* is just a fancy security term that defines a security view of an application user. Note that a subject does not have to represent a human being and could for example be a 3rd party system that connects to your application.

For the sake of simplicity, we'll assume that all users are stored in the same database table and are uniquely identified by an `id` integer. We'll implement the abstract `getPrincipal()` method in order to let Bluejay know what attribute to use as an identifier. A `principal` is another security term that defines an identifying attribute for an application user.

```typescript
import { Subject } from '@bluejay/access-control';

export class UserSubject extends Subject<{ id: number }> {
  public getPrincipal() {
    return this.get('id');
  }

  // Note: you can perfectly add custom methods here
}
```

We'll then need to tell Bluejay where to look for permissions. AccessControl comes package with a built-in `MemoryStore` that allows you to manage permissions in memory. We'll cover persistent stores later in this documentation.

```typescript
import { MemoryStore } from '@bluejay/access-control';

const store = new MemoryStore();
```

Now let's create an instance of Bluejay's AccessControl to be used across the application.

```typescript
import { AccessControlManager } from '@bluejay/access-control';

const accessControl = new AccessControlManager({ store });
```

We're now ready to declare permissions:

```typescript
const customer = new UserSubject({ id: 1 });
const admin = new UserSubject({ id: 2 });

store
  .addPermissionToRole(Role.CUSTOMER, { // Limited power for customers
    id: 'CustomerPostsPolicy',
    effect: 'allow',
    resource: 'posts',
    action: ['create', 'read']
  })
  .addPermissionToRole(Role.ADMIN, { // Full power for admins
    id: 'AdminPolicy',
    effect: 'allow',
    resource: '*',
    action: '*'
  })
  .addRoleToSubject(customer, Role.CUSTOMER)
  .addRoleToSubject(admin, Role.ADMIN);
```

We can finally check our users permissions:

```typescript
await accessControl.can(customer, 'posts', 'create'); // true
await accessControl.can(customer, 'posts', 'update'); // false
await accessControl.can(admin, 'posts', 'delete'); // true
```

### Simple attribute based access control

ABAC (Attribute Based Access Control) provides an fine-grained control over which attributes a particular role is able to access. The following examples assume that you have already read the RBAC examples.

Let's create some more specific permission:

```typescript
store
  .addPermissionToRole(Role.CUSTOMER, {
    id: 'CustomerCreatePostPolicy',
    effect: 'allow',
    resource: 'posts',
    action: 'create',
    condition: {
      stringEquals: {
        forAllValues: {
          bodyAttributes: ['title', 'content']
        }
      }
    }
  })
  .addPermissionToRole(Role.ADMIN, {
    id: 'AdminPolicy',
    effect: 'allow',
    resource: '*',
    action: '*'
  });
```

The `condition` part defines a set of rules used to evaluate whether or not the permission is applicable. Conditions are defined in a 3 levels object that can be described as follows:
- operator (`stringEquals` in our case)
    - modifier (`forAllValues` in our case)
        - attributeName (`bodyAttributes` in our case)

An `operator` defines what type of data we're comparing and how to compare then. Example operators are `dateEquals`, `numberGreaterThan`, `bool`, `stringNotEquals`, ...
A `modifier` defines the type of input data (single value vs. array) as well as how to interpret them. Example modifiers are `forAllValues`, `simpleValue`, `simpleValueIfExists`
An `attributeName` defines an attribute that is expected to be present in the `environment`. Our example defines `bodyAttributes` which is meant to contain the attributes of the POST request's body.

We are essentially saying that *for all values* in `bodyAttributes`, we expect to find an *equal string* in the provided condition values. Stated another way, we expect the body to only contain attributes that are listed in the condition values.

We'll be building a simple express POST endpoint that allows consumers to create blog posts. We'll assume that the request has been authenticated and the current user stored as `req.user`. We'll also assume that the request's body has already been validated and contains only valid values in regards to the data model.

We will be making use of Bluejay's `Keys` utility, which helps performing various attribute related operations on objects and arrays, in a format that is understood by Bluejay.

```typescript
import { Keys } from '@bluejay/access-control';

app.post('/posts', authenticate(), validatePostBody(), async (req: Request, res: Response) => {
  const body: Partial<IPost> = req.body;

  const subject = new UserSubject(req.user);

  // We're passing the body's attributes in the environment. Keys.list() will make sure that the resulting list of attributes
  // is understandable by Bluejay.
  const isAllowed = await accessControl.can(subject, 'posts', 'create', { bodyAttributes: Keys.list(body) });

  // For an admin user, since no attributes condition has been defined in the permission, any body will be authorized.
  // For a customer user, the access will only be authorized if all attributes in the body are listed in the permission.

  if (isAllowed) {
    await postService.create(body);
    res.status(201).end();
  } else {
    res.status(403).end();
  }
});
```

### Condition variables

Bluejay provides us with a powerful way of defining variables as condition values, making permissions dynamic.

Let's say that we want to expose an endpoint and allows our users to modify their information. We need to make sure that a given user can only modify their own information, and no one else's. A naive way of defining permissions would look like the following.

```typescript
store
  .addPermissionToRole(Role.CUSTOMER, {
    id: 'CustomerUpdateInformationPolicy',
    effect: 'allow',
    resource: 'users',
    action: 'update',
    condition: {
      numberEquals: {
        simpleValue: {
          id: '?????' // Here we would need to create one permission per user!
        }
      }
    }
  })
```

Thanks to Bluejay's variables, we have a more dynamic way of doing this.

```typescript
store
  .addPermissionToRole(Role.CUSTOMER, {
    id: 'CustomerUpdateInformationPolicy',
    effect: 'allow',
    resource: 'users',
    action: 'update',
    condition: {
      numberEquals: {
        simpleValue: {
          'params.id': '{{{subject.id}}}' // This will be evaluated at runtime
        }
      }
    }
  })
```

Now let's look at the endpoint itself.

```typescript
app.patch('/users/:id', authenticate(), validatePatchBody(), async (req: Request, res: Response) => {
  const body: Partial<IPost> = req.body;

  const subject = new UserSubject(req.user);

  // We're passing both the id and the subject to the environment
  const isAllowed = await accessControl.can(subject, 'posts', 'create', { params: req.params, subject: subject.toJSON() });

  // An admin user will be allowed to update any user. The id and subject in the environment will not even be used since no condition is defined.
  // A customer, on the other side, will only be able to update their own user.

  if (isAllowed) {
    await userService.update({ id: req.params.id }, body);
    res.status(204).end();
  } else {
    res.status(403).end();
  }
});
```


### Filtering returned attributes

It is important to understand that access control validates a request and has therefore no influence over the response that you send to your consumers.

If you need to control which fields are exposed in the responses to your different consumers, one solution is to have them explicitly request the set of attributes that they want to see returned. If this is how your application behaves, then you can validate the attributes that a particular user is requesting using a permission that would look like this:

```typescript
ac.addPermissionToRole(Role.CUSTOMER, {
  id: 'CustomerReadPostPolicy',
  effect: 'allow',
  resource: 'posts',
  action: 'read',
  condition: {
    stringEquals: {
      forAllValues: {
        fields: ['id', 'title', 'content', 'created_by']
      }
    }
  }
});
```

In this condition, we are essentially saying that *for all values* in `fields`, we expect to find an *equal string* in the permission's values.

```typescript
// We'll assume that the consumers make calls that look like "GET /posts?fields=id,title,content" where the `fields` query parameter defines the fields to be returned as a response.

app.get('/posts', authenticate(), async (req: Request, res: Response) => {
  const fields = (req.query.fields || '').split(',');
  const subject = new UserSubject(req.user);

  // We're passing the fields in the environment hash so that they can be evaluated
  const access = await accessControl.authorize(subject, 'posts', 'read', { fields });

  if (access.isAllowed()) {
    // The application is responsible for only returning the fields that have been requested. The access control has made sure that only allowed attributes have been requested, so you can safely pass the fields to your service.
    const data = await postService.list({ fields });
    res.status(200).json(data);
  } else {
    res.status(403).end();
  }
});
```

However, in most applications, the consumer is not expected to provide the fields they want to see returned. Bluejay provides you with a convenient way of dealing with this use case by introducing a special `returnedAttributes` property in the permission definition. With this knowledge, we can refactor the previous permission to this one:

```typescript
ac.addPermissionToRole(Role.CUSTOMER, {
  id: 'CustomerReadPostPolicy',
  effect: 'allow',
  resource: 'posts',
  action: 'read',
  returnedAttributes: ['id', 'title', 'content', 'created_by']
});

// We'll now assume that consumers make calls that look like "GET /posts".

app.get('/posts', authenticate(), async (req: Request, res: Response) => {
  const subject = new UserSubject(req.user);

  // We're not passing any environment data here since the request does not contain any attribute information that could be useful to determine access. the `returnedAttributes` are simply ignored by Bluejay.
  const access = await accessControl.authorize(subject, 'posts', 'read');

  if (access.isAllowed()) {
    // This time, instead of using the request's `fields`, we're using the fields defined in the permission and accessible through `getReturnedAttributes()` on the access.
    const data = await postService.list({ fields: access.getReturnedAttributes() || [] }); // Depending on who's calling, the returned attributes might be undefined
    res.status(200).json(data);
  } else {
    res.status(403).end();
  }
});
```

It is important to note that Bluejay only acts as a middleman here and never uses `returnedAttributes` to determine access.

Also alternatively, if you are not able to have your services only return a specific set of attributes, you can use Bluejay's `Keys` utility to filter the payload before responding:

```typescript
import { Keys } from '@bluejay/access-control';

app.get('/posts', authenticate(), async (req: Request, res: Response) => {
  const subject = new UserSubject(req.user);

  // We're not passing any environment data here since the request does not contain any attribute information that could be useful to determine access. the `returnedAttributes` are simply ignored by the authorizer.
  const access = await accessControl.authorize(subject, 'posts', 'read');

  if (access.isAllowed()) {
    const data = await postService.list();

    // Keys.filter() accepts both objects and arrays
    const payload = Keys.filter(data, access.getReturnedAttributes())

    res.status(200).json(payload);
  } else {
    res.status(403).end();
  }
});
```

### Returned attributes in depth: pattern matching and the `Keys` utility

The following examples apply to systems where the returned attributes are manually filtered using the `Keys.filter()` utility.

Bluejay uses a proprietary syntax for describing `returnedAttributes` in combination with `Keys`. The reason is that we want to offer a custom-fit experience when dealing with those attributes as well as make sure that we only perform necessary operations in order to obtain the best possible performance.

The examples below use a data structure that describes a blog post with various attributes.

```typescript
type BlogPost = {
  id: number:
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
    email: string;
    hobbies: string[];
  },
  comments: {
    id: number;
    content: string;
    author: {
      id: number;
      username: string;
      email: string;
      hobbies: string[];
    }
  }[];
}
```

#### Whitelist approach

Whitelisting is the recommended way to describe your returned attributes, because it offers you the peace of mind and clarity of knowing what exactly is being returned to your user.

Let's say we want the author of a blog post to receive all information about a blog post except the email addresses of the comments authors. We would write the returned attributes as such:

```typescript
const permission: TPermission = {
  id: 'User:BlogPost:GetItem',
  resource: 'blog-posts',
  action: 'get-item',
  effect: PermissionEffect.ALLOW,
  returnedAttributes: [
    'id',
    'title',
    'content',
    'author.id',
    'author.username',
    'author.email',
    'author.hobbies',
    'comments.[].id',
    'comments.[].content',
    'comments.[].author.id',
    'comments.[].author.username',
    'comments.[].author.hobbies',
 ]
};
```

Because we omitted `comments.[].author.email`, the user won't see the commenters emails, assuming that we filtered the payload using `Keys.filter()`.

#### The `!` (bang) operator or the blacklist approach

While the whitelist approach provides the most security, there are times where you will prefer to not describe all fields but rather exclude particular fields from the payload. Here comes the `!` operator. In order to obtain the exact same result as previously, we could rewrite the permission as such:

```typescript
const permission: TPermission = {
  id: 'User:BlogPost:GetItem',
  resource: 'blog-posts',
  action: 'get-item',
  effect: PermissionEffect.ALLOW,
  returnedAttributes: [
    '!comments.[].author.email',
  ]
};
```

Magic!

*Note:* It is not possible to combine the whitelist and blacklist approaches in a given `returnedAttributes` array


#### The `*` (wild card) operator

The simplest and most permissive `returnedAttributes` can be written as such:

```typescript
const permission: TPermission = {
  id: 'User:BlogPost:GetItem',
  resource: 'blog-posts',
  action: 'get-item',
  effect: PermissionEffect.ALLOW,
  returnedAttributes: '*'
};
```

This basically means: return everything.


We could also want to simplify part of the returned attributes by combining the whitelist approach and the wild cards. We could for example rewrite the initial example as such:

```typescript
const permission: TPermission = {
  id: 'User:BlogPost:GetItem',
  resource: 'blog-posts',
  action: 'get-item',
  effect: PermissionEffect.ALLOW,
  returnedAttributes: [
    'id',
    'title',
    'content',
    'author.*',
    'comments.[].id',
    'comments.[].content',
    'comments.[].author.id',
    'comments.[].author.username',
    'comments.[].author.hobbies',
 ]
};
```

Notice the `author.*` that basically says: returned everything in the nested `author` object. Note that this doesn't have any influence over the nested `author` objects in the `comments`, but exclusively at the root of the object.

*Info:* When you use the blacklist approach, a `returnedAttributes` with a value of `['!comments.[].author.email']` is essentially equivalent to `['*', '!comments.[].author.email']`

#### Arrays and the `[]` (unwind) operator

You may have noticed the particular syntax for the `comments` array in the previous examples. This operator allows us to say "for each element in the array, apply the following pattern". It is particularly useful when dealing with lists of objects with no predefined length.

When dealing with tuples though, each element in the array can be referenced by its index. Let's say, for example, that we only want users to receive the first comment from the `comments` array. We would write the permission as such:


```typescript
const permission: TPermission = {
  id: 'User:BlogPost:GetItem',
  resource: 'blog-posts',
  action: 'get-item',
  effect: PermissionEffect.ALLOW,
  returnedAttributes: [
    'id',
    'title',
    'content',
    'author.*',
    'comments.0.id',
    'comments.0.content',
    'comments.0.author.id',
    'comments.0.author.username',
    'comments.0.author.hobbies',
 ]
};
```

This will ensure that only the first comment is returned.


## Inspirations

Special heads up to the following modules and their creators for the precious inspiration:
- [Apache Shiro](https://shiro.apache.org/index.html)
- [AWS IAM](http://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
- [AccessControl](https://onury.io/accesscontrol/?content=guide)
