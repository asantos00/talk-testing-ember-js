# Testing ember

## Who am I?

I'm Alexandre Santos, I've been working at Uniplaces for a year and so, mainly
with javascript. I'm now working in the Search Team, project that I'm going to
make a lot of references.

## Testing ember

So, as many of you already told, every single one of us had for sure
written/read/reviewed at least a few lines of ember.

The ones who have used it, who have worked on projects know that it is no
coincidence that when you create a new component using `ember-cli` it also
creates a test file, can you guess why? ;)

Quoting ember documentation:

> Testing is a core part of the Ember framework and its development cycle.

### What types of tests we have in ember?

We all know the pyramid of testing, the names of the layers can change, but what
matters is that as you go up on the pyramid, tests become more high level,
slower and consequently more expensive. Each layer is also representing the
amount of tests we should have. I would also say that the number of side effects
each type of tests have also grows with money and latency.

![test-piramid](https://martinfowler.com/bliki/images/testPyramid/test-pyramid.png)

In ember we have the same 3 layers, with slightly different names:

* **Unit** (barely no side effects, testing almost at a function level)
* **Integration** (testing components and routes, more side effects and
  dependencies, more _real_ also)
* **Acceptance** (_QA_ like tests, using a browser and literally doing actions
  the user would do)

Ember comes with a set of testing tools, pretty integrated with the ecossystem
and that you can easily run using `ember t`. At the moment, version `2.16`,
ember uses `qunit` and `ember-qunit` to do assertions, uses headless Chrome to
render the components, with some more ember helpers to make things easier. But
enought of theory, let's get our hands dirty.

## Unit tests

Common use cases of unit tests are utils, helpers, services, mixins. Normally we
just test the behaviour (input and output of functions). Unit tests are closer
to the code and consequently, the simpler ones.

## Integration tests

Common usages of integration tests are components and handlebars helpers. They
normally have more side effects than unit tests, and in ember integration tests
mean we're rendering the component/helper by itself, without the app around it.
Normally we test the component behaviour, both visually and in terms of actions
called.

## Acceptance tests

Acceptance tests are made to test a flow, in contrast to what happens to
integration or unit tests, acceptance tests are not generated when we're
creating components or utils, we have to generate them using `ember g
acceptance-test testname`. And this also reflects their usage, you're going to
write a lot less acceptance tests than other tests, as we said.

But keep in mind that those are the ones that test the whole flow, with lots of
side effects but also with lots of value to users and to QA's.

## Testing bad vs Good
- Get an "old" test and show how to enrich it (`ember-native-dom-helpers`, `ember-qunit`, `qunit-dom`, show `budget-slider` example)
- Development mode
- `ember-cli-mirage` (faker, traits)
- `ember-cli-page-object`
- `ember-try`

## Mirage and faker.js

It would be super boring, and less reliable to write tests in ember without some
very well known tools. I'm going to mention some of the crucial helpers we use
but I want to give full credit to `ember-cli-mirage` and `faker.js`.

For those who don't know, mirage is "client side server" as they say in their
website. It just intercepts HTTP requests and answers them with generated
responses with fake data and logic.

Those tools give us the possibility to have our app fully working without a real
server, we're able to write a full app without even having a server.

### Factories

Mirage factories allow us to generate data to models using faker.js, example
below.

```javascript
export default Factory.extend({
  type: "offer",
  id: () => faker.random.number({ max: MAX_OFFER_ID }),
  attributes: {
    accommodation_offer: {
      id: () => faker.random.number({ max: MAX_OFFER_ID }),
      version: 19,
      titles: {
        en_GB: () => faker.lorem.words(5),
        de_DE: () => faker.lorem.words(5)
      },
      property: {
        unit_id: () => faker.random.uuid(),
        subunit_id: () => faker.random.uuid()
      }
    }
  }
});
```

## Traits

You can see the flexibility we can have from this, we are also able to create
what mirage calls `traits`, that are variations of this factories. We can create
per example an offer that has, according to parameters, a restriction for males
or females, or a different price.

## Handlers

```javascript
this.urlPrefix = config.searchHost;

this.get("/offers", schema => {
  return {
    type: "offers",
    data: schema.db.offers
  };
});

this.put("/guests/:id/wish-list", () => {
  return new Mirage.Response(204);
});

this.passthrough("https://a.tiles.mapbox.com/**");
```

Mirage makes it easy to intercept and respond to requests. It is possible to
create logic to handle request parameters and respond according to it using its
factories

## Test unification

I've been using some asynchronous helpers, both in `acceptance` and in
`integration` tests, some of you might ask:

> Why am I not using the test syntax that figures on the documentation?

This is due to a proposal made by Robert Jackson, one of the main ember
contributors (@rwjblue) to **unify all ember testing**. The link is in the notes
but TLDR is that ember officaly was two very different syntax for testing
`acceptance` and `integration`, that leads to some confusion, making it harder
to understand and forcing developers to _change context_ while writing tests.

This is why I've been writing tests using `click`, `triggerEvent` and all those
helpers. This is also now a standard in Uniplaces' Ember codebase so it is worth
checking out :).

## Tips

* when running multiple assertions, make sure you provide an assertion
  description
* pauseTest acceptance tests to develop in what state you want
  (https://blog.embermap.com/my-ember-js-tdd-workflow-47847c6dbdfa)
* use `--serve` and /tests
* use two way data binding to see component _inside work_
* add test tags when needed to not use super complex and breakable selectors
