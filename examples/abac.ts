import { MemoryStore, AccessControl, Subject, PermissionEffect, Keys } from '../';
import * as express from 'express';
import { NextFunction, Response, Request } from 'express';
import bodyParser = require('body-parser');
import { StatusCode } from '@bluejay/status-code';
import * as supertest from 'supertest';
import { WILD_CARD } from '../src/constants/wild-card';
import { expect } from 'chai';

class UserSubject extends Subject<{ name: string }> {
  public getPrincipal() {
    return this.get('name');
  }
}

enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

interface ICustomRequest extends Request {
  subject: UserSubject;
}

const app = express();
app.use(bodyParser.json());

const store = new MemoryStore();
const accessControl = new AccessControl({ store });

const john = new UserSubject({ name: 'john' });
const brian = new UserSubject({ name: 'brian' });

store
  .addPermissionToRole(Role.ADMIN, {
    id: 'AdminPolicy',
    effect: PermissionEffect.ALLOW,
    resource: '*',
    action: '*'
  })
  .addPermissionToRole(Role.CUSTOMER, {
    id: 'CustomerCreatePostPolicy',
    effect: PermissionEffect.ALLOW,
    resource: 'posts',
    action: 'create',
    returnedAttributes: ['title', 'content', 'user_id'],
    condition: {
      stringEquals: {
        forAllValues: {
          bodyAttributes: ['title', 'content', 'tags.[].name']
        }
      }
    }
  })
  .addPermissionToRole(Role.CUSTOMER, {
    id: 'CustomerUpdatePostPolicyNullContent',
    effect: PermissionEffect.ALLOW,
    resource: 'posts',
    action: 'update',
    condition: {
      null: {
        simpleValue: {
          'body.content': 'true'
        }
      }
    }
  })
  .addPermissionToRole(Role.CUSTOMER, {
    id: 'CustomerListPostPolicy',
    effect: PermissionEffect.ALLOW,
    resource: 'posts',
    action: 'list',
    customData: { businessRule: 'rule1' },
    condition: {
      numberLowerThanEquals: {
        simpleValueIfExists: {
          'query.limit': '100'
        }
      }
    }
  })
  .addRoleToSubject(john, Role.ADMIN)
  .addRoleToSubject(brian, Role.CUSTOMER);

// Simple/fake authentication middleware that will create a subject based on the headers.
function authenticate(req: ICustomRequest, res: Response, next: NextFunction) {
  req.subject = new UserSubject({ name: req.get('x-me') as string });
  next();
}

// We expose a POST /posts endpoint that allows users to create posts.
app.post('/posts', authenticate, async (req: ICustomRequest, res: Response) => {
  const { body } = req;

  // We request the authorization and include the body's attributes for the access control to check the properties it contains.
  const access = await accessControl.authorize(req.subject, 'posts', 'create', { bodyAttributes: Keys.list(body) });

  if (access.isAllowed()) {
    // Set the user id if not set in the body, ie. when Brian creates a post.
    if (!body.user_id) {
      body.user_id = req.subject.getPrincipal();
    }

    // Set some sensitive data for this example.
    body.sensitive_data = 'foo';

    // We're filtering the fields that get returned based on the returnedAttributes we stored in the permission.
    // If no returned attributes are defined, we'll consider that the user is admin and return them all.
    const payload = Keys.filter(body,access.getReturnedAttributes() || WILD_CARD);

    res.status(StatusCode.CREATED).json(payload);
  } else {
    res.status(StatusCode.FORBIDDEN).end();
  }
});

app.get('/posts', authenticate, async (req: ICustomRequest, res: Response) => {
  const { query } = req;

  if (req.query.limit) {
    req.query.limit = parseInt(req.query.limit, 10);
  }

  const access = await accessControl.authorize(req.subject, 'posts', 'list', { query });

  if (access.isAllowed()) {
    if(access.getCustomData()) {
      res.status(StatusCode.OK).json(access.getCustomData());
    } else {
      res.status(StatusCode.OK).end();
    }
  } else {
    res.status(StatusCode.FORBIDDEN).end();
  }


});

app.patch('/posts/:id', authenticate, async (req: ICustomRequest, res: Response) => {
  const { body } = req;

  const access = await accessControl.authorize(req.subject, 'posts', 'update', { body });

  if (access.isAllowed()) {
    res.status(StatusCode.OK).end();
  } else {
    res.status(StatusCode.FORBIDDEN).end();
  }
});

Promise.resolve().then(async () => {
  await supertest(app)
    .post('/posts')
    .set('x-me', 'john')
    .send({ title: 'foo', content: 'bar', user_id: 'brian' }) // John can create a post on behalf of Brian
    .expect(StatusCode.CREATED, { title: 'foo', content: 'bar', user_id: 'brian', sensitive_data: 'foo' }); // John receives the sensitive data

  await supertest(app)
    .post('/posts')
    .set('x-me', 'brian')
    .send({ title: 'foo', content: 'bar', tags: [{ name: 'foo' }] }) // Brian can create a post for himself
    .expect(StatusCode.CREATED, { title: 'foo', content: 'bar', user_id: 'brian' }); // Brian does NOT receive the sensitive data

  await supertest(app)
    .post('/posts')
    .set('x-me', 'brian')
    .send({ title: 'foo', content: 'bar', user_id: 'john' })  // Brian can NOT create a post on behalf of John
    .expect(StatusCode.FORBIDDEN);

  const response = await supertest(app)
    .get('/posts')
    .set('x-me', 'brian')
    .expect(StatusCode.OK);  // No `limit` provided: the request is authorized.
  expect(response.body).to.deep.equal({ businessRule: 'rule1' });

  await supertest(app)
    .get('/posts')
    .set('x-me', 'brian')
    .query({ limit: 20 })
    .expect(StatusCode.OK); // limit=20, which is lower than 100: the request is authorized.

  await supertest(app)
    .get('/posts')
    .set('x-me', 'brian')
    .query({ limit: 110 })
    .expect(StatusCode.FORBIDDEN); // limit=110, which is greater than 100: the request is NOT authorized.

  await supertest(app)
    .patch('/posts/1')
    .set('x-me', 'brian')
    .send({ content: null })
    .expect(StatusCode.OK); // Brian can erase the content.

  await supertest(app)
    .patch('/posts/1')
    .set('x-me', 'brian')
    .send({ content: 'forbidden' }) // Brian cannot modify the content.
    .expect(StatusCode.FORBIDDEN);

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});