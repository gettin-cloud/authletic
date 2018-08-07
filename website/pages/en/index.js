/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className={`button${this.props.highlight ? ' highlight' : ''}`} href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: '_self',
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeContainerBG"></div>
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const Framework = props => (
  <img src={imgUrl(props.image)} title={props.name} className="frameworkLogo" />
);

const Frameworks = props => (
  <div className="frameworksRoot">
    <h2>Friendly Technology Stack</h2>
    <div className="frameworks">
      <div className="frameworkTitle">API:</div>
      <Framework image="logo_node.png" name="NodeJS" />
      <Framework image="logo_express.png" name="Express" />
      <Framework image="logo_serverless.png" name="Serverless" />
      <Framework image="logo_aws.png" name="Amazon Web Services" />
    </div>
    <div className="frameworks">
      <div className="frameworkTitle">UI:</div>
      <Framework image="logo_react.png" name="React" />
      <Framework image="logo_angular.png" name="Angular" />
      <Framework image="logo_vue.png" name="Vue" />
      <Framework image="logo_bootstrap.png" name="Bootstrap" />
    </div>
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    SaaS Bricks for Modern Apps
    <div className="subtitle">
      <MarkdownBlock>
        Don't reinvent the wheel. Use scalable and secure solutions with zero development, deployment and maintanance costs.
      </MarkdownBlock>
    </div>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
          <Button href="#try" highlight>Explore Solutions</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Solution = props => (
  <div className="item">
    <div className="card">
      <div className="colored" style={{ backgroundColor: props.color }}>
        <h3>{props.title}</h3>
        <div className="image"><img src={imgUrl('email.png')} /></div>
        <p className="features">
          {props.features}
        </p>
      </div>
      <div className="desc">
        <p>{props.description}</p>
        <div className="buttons">
          <a href="#">Gettin Started</a>
          <a
            href="#"
            className="demo"
            style={{
              borderColor: props.color,
              color: props.color,
            }}
          >View Demo</a>
        </div>
      </div>
    </div>
  </div>
);

const Solutions = props => {
  return (
    <div className="solutions">
      <h2>Solutions</h2>
      <p className="subtitle">Hosted&nbsp;RESTful APIs bound to&nbsp;React, Angular or Vue UI</p>
      <div className="container">
        <Solution
          title="Authentication"
          description="Login Forms and Social Networks"
          color="#039be5"
          features="Setup and deploy scalable user registration and authentication API in minutes. Easily connect your Login and Sign Up forms to the API"
        />
        <Solution
          title="Sending Emails"
          description="Transactional and Marketing"
          color="#ef6c00"
          features={"Create, store and manage email templates. Send emails to single recepients or user groups. Seamlessly integrate with Saasless Analytics"}
        />
        <Solution
          title="File Management"
          description="Upload, Process, Store, Download"
          color="#304ffe"
          features={"Upload multiple files at once. Allow your users to copy-paste and drag'n'drop files to upload. Manage file folders. Enable CDN for downloading"}
        />
        <Solution
          title="Image Processing"
          description="Resizing, Cropping, Watermarks"
          color="#009688"
          features={"Create thumbnails, resize and crop images on-the-fly. Provide image editing capability for you end-users. Protect images by watermarks"}
        />
        <Solution
          title="CRUD / CMS"
          description="Manage you Domain Entities"
          color="#8bc34a"
          features={"Store your app data in SQL or NoSQL data bases. Describe entity properties and relationships and get a ready-to-use CMS UI automatically"}
        />
        <Solution
          title="Notifications"
          description="Live Updates via WebScokets"
          color="#8c0032"
          features={"Empower you app UI with instant updates. Send push notifications controlling their target recepients and process them on the client-side"}
        />
        <Solution
          title="Logging"
          description="Errors and Activities"
          color="#33691e"
          features={"Seamlessly enable loggin in your application on both server and client sides. Track and record errors with the action trails that cause them"}
        />
        <Solution
          title="Analytics"
          description="Collect and Analyse Events"
          color="#8532b7"
          features={"Collect, store, process and visualize data to analyse. Build simple charts and complex dashboards with Saasless Analytics API and UI suite"}
        />
        <Solution
          title="Suggest a Solution"
          description="Experiencing a Dev Pain?"
          color="#607d8b"
          features={"Let us know if we can do something to simplify a JavaScript developer life. What are you struggling with right now? What can we improve?"}
        />
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    return (
      <div>
        <HomeSplash />
        <div className="mainContainer">
          <Frameworks />
          <Solutions />
        </div>
      </div>
    );
  }
}

module.exports = Index;
