// Import React
import React from 'react';
import CodeSlide from 'spectacle-code-slide';

// Import Spectacle Core tags
import {
  BlockQuote,
  Cite,
  Deck,
  Heading,
  ListItem,
  List,
  Quote,
  Slide,
  Text,
  Image,
  Appear,
  Notes,
} from 'spectacle';

// Import theme
import createTheme from 'spectacle/lib/themes/default';

// Require CSS
require('normalize.css');

const theme = createTheme( {
  primary: "#00adef",
  secondary: "#222",
  clear: "white",
  medium: "#ccc",
  darkMedium: "#555"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck progress="number" transition={["zoom", "slide"]} transitionDuration={333} theme={theme}>
        <Slide transition={["zoom"]} bgColor="clear">
          <Heading size={6} caps lineHeight={1} textColor="medium">
            javascript guild
          </Heading>
          <Heading fit caps lineHeight={1} textColor="secondary">
            testing ember js
          </Heading>
          <Appear>
            <Heading margin="20 0 0 0" size={4} caps lineHeight={1} textColor="primary">
              testing-ember-js.netlify.com
            </Heading>
          </Appear>
          <Notes>
            <p>
              <p>testing is core for us in the backend</p>
              <p>we are getting stricter in the frontend, asking for tests</p>
              <p>we been evolving and getting more and better tests</p>
            </p>
          </Notes>
        </Slide>
        <Slide transition={["zoom"]} bgColor="primary">
          <Heading size={4} fit caps lineHeight={1} textColor="secondary">
            Testing in ember
          </Heading>
          <Text margin="80px 0 0" fit textColor="clear" textSize={50}>
            `ember g component budget-slider`
          </Text>
          <Notes>
            <p>
              Testing is a core part of the Ember framework and its development cycle.
            </p>
          </Notes>
        </Slide>
        <Slide transition={["zoom"]} bgColor="secondary">
          <Heading size={4} lineHeight={1} textColor="clear">
            "Testing is a core part of the Ember framework and its development cycle."
          </Heading>
          <Text margin="80px 0 0" textColor="medium" textSize={50}>
            https://guides.emberjs.com 
          </Text>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <Image 
            height={"100%"}
            src="https://martinfowler.com/bliki/images/testPyramid/test-pyramid.png"
          />
          <Notes>
            <p>
              **Unit** (barely no side effects, testing almost at a function level)
            </p>
            <p>
              **Integration** (testing components and routes, more side effects and dependencies, more _real_ also)
            </p>
            <p>
              **Acceptance** (_QA_ like tests, using a browser and literally doing actions
            </p>
          </Notes>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <Heading size={4} lineHeight={1} textColor="darkMedium">
            Unit tests
          </Heading>
          <Text margin="80px 0 0" textColor="medium" fit textSize={50}>
            logger, notifications, header-triggers, current-user
          </Text>
          <Notes>
            <p>
              <p>Test merely functions</p>
              <p>Input and output are fairly standard</p>
              <p>The easiest to write, less side effects</p>
              <p>Closer to the code</p>
            </p>
          </Notes>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <Heading size={4} lineHeight={1} textColor="darkMedium">
            Integration tests
          </Heading>
          <Text margin="80px 0 0" textColor="medium" fit textSize={50}>
            to-money, budget-slider, results-line, offer-card
          </Text>
          <Notes>
            <p>
              <p>Test in the vacuum</p>
              <p>Actually renders components</p>
              <p>Normally test component actions and behaviours</p>
            </p>
          </Notes>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <Heading size={4} lineHeight={1} textColor="darkMedium">
            Acceptance tests
          </Heading>
          <Text margin="80px 0 0" textColor="medium" fit textSize={50}>
            open-search-page, pagination, support-query-params, onboarding 
          </Text>
          <Notes>
            <p>
              <p>Not auto generated</p>
              <p>Add more value</p>
              <p>Test "as if it was an user"</p>
              <p>Could potencially save QA's work for functional tests</p>
            </p>
          </Notes>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <Heading size={6} caps lineHeight={1} textColor="medium">
            talking, talking, talking
          </Heading>
          <Heading fit caps lineHeight={1} textColor="secondary">
            show me the code
          </Heading>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <Heading size={6} caps lineHeight={1} textColor="medium">
            talking, talking, talking
          </Heading>
          <Heading fit caps lineHeight={1} textColor="secondary">
            show me the code
          </Heading>
        </Slide>
        <Slide transition={["zoom"]} bgColor="clear">
          <CodeSlide 
            lang="js"
            transition={[]}
            textSize={25}
            code={require('./examples/a-normal-test.example')}
            ranges={[
              { 
                loc: [0, 12],
                title: "now vs later",
              },
              {
                loc: [0, 5],
                title: "now",
              },
              {
                loc: [8, 11],
                title: "now"
              },
              {
                loc: [5, 6],
                title: "later (after 1000ms passed)",
              }
            ]}
          />
          <Heading fit caps lineHeight={1} textColor="secondary">
            show me the code
          </Heading>
        </Slide>
      </Deck>
    );
  }
}
