# Testing ember 

## Who am I?
I'm Alexandre Santos, I've been working at Uniplaces for a year and so, mainly with javascript. I'm now working in the Search Team, project that I'm going to make a lot of references.
 
## So, testing?
This is kinda interesting because my last talk was due to a poll I made, poll that had testing as one of the options, meaning that you guys don't wanna hear a lot about testing, but yeah, here I am.
 
**So, by raise of hands, who has written tests for the frontend?**
(I'm expecting a lot of positive answers)
 
**With the tests you wrote for the frontend, are you confortable enough to deploy to production on merge?**
 (I'm expecting to see less positive answers, but still some)
 
**Are we taking the most how of our QAs?**
My guess here is **no, we aren't**. We're having people doing jobs we can automate. If we automate some tests they have time to test the things they really need to test.

*Possible photos of BO saying "it is broken on prod"*
*Possible photos of people asking for tests in reviews and people getting mad*

That's what this talk is all about. Let's avoid reopens a test could have caught. Let's sleep better at night.

## Testing ember
So, as many of you already told, every single one of us had for sure written/read/reviewed at least a few lines of ember.

The ones who have used it, who have worked on projects know that it is no coincidence that when you create a new component using `ember-cli` it also creates a test file, can you guess why? ;) 

Quoting ember documentation:
> Testing is a core part of the Ember framework and its development cycle.

### What types of tests we have in ember?

We all know the pyramid of testing, the names of the layers can change, but what matters is that as you go up on the pyramid, tests become more high level, slower and consequently more expensive. Each layer is also representing the amount of tests we should have. I would also say that the number of side effects each type of tests have also grows with money and latency.

![test-piramid](https://martinfowler.com/bliki/images/testPyramid/test-pyramid.png)

In ember we have the same 3 layers, with slightly different names:
- **Unit** (barely no side effects, testing almost at a function level)
- **Integration** (testing components and routes, more side effects and dependencies, more *real* also)
- **Acceptance** (*QA* like tests, using a browser and literally doing actions the user would do)

Ember comes with a set of testing tools, pretty integrated with the ecossystem and that you can easily run using `ember t`. At the moment, version `2.16`, ember uses `qunit` and `ember-qunit` to do assertions, uses headless Chrome to render the components, with some more ember helpers to make things easier. But enought of theory, let's get our hands dirty.

## Unit tests
Common use cases of unit tests are utils, helpers, services, mixins. Normally we just test the behaviour (input and output of functions). Unit tests are closer to the code and consequently, the simpler ones.

An example
```javascript
const CurrencyTypeSymbol = {
  EUR: '€',
  GBP: '£',
  USD: '$'
}

export default function toMoney(amount, currencyCode) {
  return `${amount / 100}${CurrencyTypeSymbol[currencyCode]}`;
}
```

Its test
```javascript
import toMoney from 'dummy/utils/to-money';
import { module, test } from 'qunit';

module('Unit | Utility | to money');

test('It works with EUR', function(assert) {
  assert.expect(2);

  let result = toMoney(10000, 'EUR');

  assert.ok(result);
  assert.equal(result, '100€');
});

test('It works with GBP', function(assert) {
  assert.expect(2);

  let result = toMoney(10000, 'GBP');

  assert.ok(result);
  assert.equal(result, '100£');
});
```

A simple test that just tests the output of the function. I can say that we have a lot of cool unit tests, testing what they should. But looking at the pyramid again, this tests give more to developers that to real users and QA's, let's get to the next layer.

## Integration tests
Common usages of integration tests are components and handlebars helpers. They normally have more side effects than unit tests, and in ember integration tests mean we're rendering the component/helper by itself, without the app around it. Normally we test the component behaviour, both visually and in terms of actions called.

### Example

**Spoiler alert - Coming from a project that is not (yet) live**
![budget-slider](https://image.ibb.co/dhUkew/Screen_Shot_2017_12_28_at_22_46_29.png)

### The code
I will not show the slider's code, it would be pretty messy to have a little more complex code here, and that's not want we want. That's also not how I think we should think when writing integration tests.

### The mindset - how should this component work?

So, we have a slider, let's describe its basic functionality, let's think about what should it do before we start writing the tests.

- We should be able to pass in an *initial state* for the slider
- It should move to a position when clicked
- It should be possible to click and drag sideways to adjust the value
- Value should always be synced with the slider's position
- It should call the onChange action when the value changes

**Test - it changes budget to 1/4 of price range when dragging to 1/4 of the bar**
```javascript
test('it changes budget to 1/4 of price when dragging to 1/4 of the bar', async function(assert) {
  this.setProperties({
    budget: 20,
    min: 0,
    max: 40,
    boundingBox: null
  });

  this.render(hbs`{{budget-slider boundingBox=boundingBox min=min max=max budget=budget}}`);

  let { width, x } = this.get('boundingBox');
  await triggerEvent('.budget-slider__slider__handle', 'mousedown');
  await triggerEvent('.budget-slider__input', 'mousemove', { clientX: x + (width / 4) });
  await triggerEvent('.budget-slider__slider__handle', 'mouseup');

  assert.equal(this.get('budget'), 10);
});
```

In reality, it doesn't do that much, it just sets the minimum and maximum value of the slider (0 and 40, respectively), it also sets the initial value (20).
After that, it just triggers the events that simulate the drag. So, we trigger a mousedown (half a mouse click), then we trigger a mouvemove with some coordinates, and then we trigger a mouseup (leaving the mouse). 

There are some small implementation details you can see here, I'm getting the slider's bouding box so I know which coordinates to click, just to confirm that if I move the slider to 1/4 of its bar, the value will update to 1/4 of his range.

I'm also using the `triggerEvent` helper, that I think is pretty intuitive, and I'm using `async` because all those calls to `triggerEvent` return a promise, and I just want to grant that we're running the first call before the second, that's what the await is for.

It was more complicated right? We're not writing unit tests anymore, but we ca also see that now we're starting to have more confidence about the component, with a few tests like this, we can almost guarantee that the component works, right? We're getting there!

## Acceptance tests
Acceptance tests are made to test a flow, in contrast to what happens to integration or unit tests, acceptance tests are not generated when we're creating components or utils, we have to generate them using `ember g acceptance-test testname`. And this also reflects their usage, you're going to write a lot less acceptance tests than other tests, as we said.

But keep in mind that those are the ones that test the whole flow, with lots of side effects but also with lots of value to users and to QA's.

```javascript
test('does a full onboarding flow', async function(assert) {
  await visit('/accommodation/lisbon');

  await click('.open-on-boarding-dummy-button');
  assert.ok(find('.uni-modal'), 'modal opens');
  assert.ok(checkStep('intro'));

  await click('.start-onboarding-button');
  assert.ok(checkStep('about-me/guest-number', 'navigated to guest number step'));

  await click('.question__answer:first-child');
  assert.ok(checkStep('about-me/occupation', 'navigated to occupation step'));

  await click('.question__answer:first-child');
  assert.ok(checkStep('rent-type', 'navigated to rent-type step'));

  await click('.question__checkboxes:first-child');
  await click('.next-button');
  assert.ok(checkStep('destination/company', 'navigated to company step'));

  await click('.skip-button');
  assert.ok(checkStep('budget', 'navigated to budget step'));

  await click('.budget-slider__slider');
  await click('[test-value="true"]');
  await click('.next-button');
  assert.ok(checkStep('dates/move-in', 'navigated to move-in step'));

  let now = moment();
  await click(`[data-test-date="${now.year()}-${now.month()}"]`);
  await click('.next-button');
  assert.ok(checkStep('dates/move-out', 'navigated to occupation step'));

  let oneYearFromNow = moment().add(1, 'year');
  await click(`[data-test-date="${oneYearFromNow.year()}-${oneYearFromNow.month()}"]`);
  await click('.next-button');
  assert.ok(checkStep('results', 'navigated to results step'));
});
```
The test itself doesn't say much, it is just a bunch of clicks that fills the whole onboarding flow, doing one of its multiples dozens of paths. I've also added some test attributes to the components for the ease of testing.

## Testing as a way to go
- I'm sure I have not showed you none super innovative way of testing, nor any super test. I showed some examples but what I want you to take out of this talk is the confidence this tests can give us, I know, it is boring to write them, but trust me, it is way more boring to be always breaking things without noticing. 
- I can't count how many times tests saved my code from bugs and `spa-search` is stil in the beggining, since rebases that apparently went well or just changing code to fix bugs and create others. And more, by writing tests you test things that sometimes are obvious but that you haven't noticed when you hand tested it. 
- And last but not least, writing tests makes you write simpler components, simpler code. If you're doing too much setup to be able to test something, my guess is that what you are testing is too complicated, it might be better to subdivide it in smaller, simpler parts.
- I want also to incentivize people to create tests for the bugs they find, it is not enforced (yet) but raise your hand if you never had a bug that you already solved coming back to you.

## Mirage and faker.js
It would be super boring, and less reliable to write tests in ember without some very well known tools. I'm going to mention some of the crucial helpers we use but I want to give full credit to `ember-cli-mirage` and `faker.js`.

For those who don't know, mirage is "client side server" as they say in their website. It just intercepts HTTP requests and answers them with generated responses with fake data and logic.

Those tools give us the possibility to have our app fully working without a real server, we're able to write a full app without even having a server.

### Factories

Mirage factories allow us to generate data to models using faker.js, example below.

```javascript
export default Factory.extend({
  type: 'offer',
  id: () => faker.random.number({ max: MAX_OFFER_ID }),
  attributes: {
    'accommodation_offer': {
      id: () => faker.random.number({ max: MAX_OFFER_ID }),
      version: 19,
      titles: {
        'en_GB': () => faker.lorem.words(5),
        'de_DE': () => faker.lorem.words(5)
      },
      property: {
        'unit_id': () => faker.random.uuid(),
        'subunit_id': () => faker.random.uuid()
      }
    }
  }
});
```

## Traits

You can see the flexibility we can have from this, we are also able to create what mirage calls `traits`, that are variations of this factories. We can create per example an offer that has, according to parameters, a restriction for males or females, or a different price.

TODO: trait example

## Handlers

```javascript
  this.urlPrefix = config.searchHost;

  this.get('/offers', (schema) => {
    return {
      type: 'offers',
      data: schema.db.offers
    };
  });

  this.put('/guests/:id/wish-list', () => {
    return new Mirage.Response(204);
  });

  this.passthrough('https://a.tiles.mapbox.com/**');
```

Mirage makes it easy to intercept and respond to requests. It is possible to create logic to handle request parameters and respond according to it using its factories

## Test unification

TODO: https://github.com/rwjblue/rfcs/blob/42/text/0000-grand-testing-unification.md








 
 
