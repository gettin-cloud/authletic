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
    <h2>Target Technology Stack</h2>
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
    {siteConfig.slogan}
    <div className="subtitle">
      <MarkdownBlock>
        Build scalable web applications at least 20X faster with Saasless JS libraries and your favorite frameworks
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
          <Button href="#try" highlight>Saasless Solutions</Button>
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
      </div>
      <div className="desc"><p>{props.description}</p></div>
    </div>
  </div>
);

const Solutions = props => {
  return (
    <div className="solutions">
      <h2>Solutions</h2>
      <p className="subtitle">NodeJS&nbsp;API and&nbsp;UI&nbsp;for React, Angular and Vue</p>
      <div className="container">
        <Solution
          title="Authentication"
          description="Login Forms and Social Networks"
          color="#039be5"
        />
        <Solution
          title="Sending Emails"
          description="Transactional and Marketing"
          color="#ef6c00"
        />
        <Solution
          title="File Management"
          description="Upload, Processing and Storing"
          color="#304ffe"
        />
        <Solution
          title="Image Processing"
          description="Resizing, Cropping, Watermarks"
          color="#009688"
        />
        <Solution
          title="CRUD"
          description="Manage you Domain Entities"
          color="#8bc34a"
        />
        <Solution
          title="Notifications"
          description="Live Updates via WebScokets"
          color="#8c0032"
        />
        <Solution
          title="Logging"
          description="Errors and Activities"
          color="#33691e"
        />
        <Solution
          title="Analytics"
          description="Collect and Analyse Events"
          color="#8532b7"
        />
        <Solution
          title="Suggest a Solution"
          description="Experiencing a Dev Pain?"
          color="#607d8b"
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
