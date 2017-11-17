# !!! WORK IN PROGRESS !!!

# AccessControl

Simple, flexible and reliable [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) / [ABAC](https://en.wikipedia.org/wiki/Attribute-based_access_control) access control for NodeJS and Typescript.

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

The `condition` part defines a set of rules used to evaluate whether or not the permission is applicable. Conditions are defined in 3 levels object that can be described as follows:
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
    const data = await postService.list({ fields: access.getReturnedAttributes() });
    
    // Keys.filter() accepts both objects and arrays
    const payload = Keys.filter(data, access.getReturnedAttributes())
    
    res.status(200).json(payload);
  } else {
    res.status(403).end();
  }
});
```


## Inspirations

Special heads up to the following modules and their creators for the precious inspiration:
- [Apache Shiro](https://shiro.apache.org/index.html)
- [AWS IAM](http://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
- [AccessControl](https://onury.io/accesscontrol/?content=guide)