<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/34fame/conflux">
    <img src="images/34fame-logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Conflux</h3>

  <p align="center">
    Conflux is a Confluence clone project written in Vue.js and utilizing the Quasar Framework.
    <br />
    <a href="https://github.com/34fame/conflux"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/34fame/conflux">View Demo</a>
    ·
    <a href="https://github.com/34fame/conflux/issues">Report Bug</a>
    ·
    <a href="https://github.com/34fame/conflux/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Conflux is __still in development__.  Currently, it is a pet project because I needed a place to document my
 projects, and I didn't want to pay a subscription fee.  So far it has been a great learning experience.
 
 
### First Glance Demo

[![Conflux](http://img.youtube.com/vi/_OBhCYtlMiA/0.jpg)](http://www.youtube.com/watch?v=_OBhCYtlMiA "Conflux - First Glance")

### What Works

- Add spaces
- Star/unstar spaces
- Edit space overview page (markdown)
- Add pages
- Star/Unstar pages
- Edit pages (markdown)
- Delete pages
- Data stored in Firestore (Google Firebase)

### Built With

- [Vue.js](https://vuejs.org)
- [Quasar Framework](https://quasar.dev)
- [QMarkdown Extension](https://quasarframework.github.io/quasar-ui-qmarkdown/docs)
- [Quasar Dotenv Extension](https://github.com/quasarframework/app-extension-dotenv)
- [Google Firebase](https://firebase.google.com/)

<!-- GETTING STARTED -->
## Getting Started

To run your own Conflux instance you'll need to have a Firebase account and a project setup for Conflux.

### Prerequisites

- [Node.js](https://nodejs.org)
- [Quasar Framework](https://quasar.dev)
```sh
npm install quasar -g
yarn global add quasar
```

- [Google Firebase](https://firebase.google.com/)
```sh
yarn global add firebase-tools
```

### Installation

- Clone the repo
```sh
git clone https://github.com/34fame/conflux.git
```

- Install NPM packages
```sh
cd conflux/client
yarn

cd conflux/server
yarn
```

- Create Client Environment File(s)
```sh 
cd conflux/client
cp .env.example .env.development
cp .env.example .env.production
```

- Configure Firebase for Client
```sh 
cd conflux/client
firebase init
```
All you need here is to enable Hosting if you plan to host within Firebase.

- Configure Firebase for Server
```sh 
cd conflux/server
firebase init
```
Include Firestore and allow overwrites of config files but NOT the `index.js`.  That way your project name is
 used everywhere.  You then need to create a Service Account and place it under the `Functions` folder as `google
 -service-account.json` (or you can update Firebase config to use a different name or path).


<!-- USAGE EXAMPLES -->
## Basic Usage

### Create a Space

A Space could be a project or topic.

### Create a Page

You can create Pages inside Spaces.  Pages can be created at the "TOP" of the Space within another Page which
 automatically creates a hierarchy.

### Managing Content

Content, as in Space Overviews and Page content, are in markdown syntax.  A great reference can be found [here](https
://www.markdownguide.org/).  The [_Mermaid_ plugin](https://mermaid-js.github.io/mermaid) is installed which supports building different diagrams.



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/34fame/conflux/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any
 contributions you make are **greatly appreciated**.  Utilize [Conventional Commits](https://www.conventionalcommits
 .org/en/v1.0.0/) when creating commit messages.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Troy Moreland - Graypes#3890 - Discord

Project Link: [https://github.com/34fame/conflux](https://github.com/34fame/conflux)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Razvan Stoenescu](https://github.com/sponsors/rstoenescu) - Quasar Framework Author
* [Jeff Galbraith](https://github.com/sponsors/hawkeye64) - Quasar Framework Developer

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/34fame/conflux
[contributors-url]: https://github.com/34fame/conflux/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/34fame/conflux
[forks-url]: https://github.com/34fame/conflux/network/members
[stars-shield]: https://img.shields.io/github/stars/34fame/conflux
[stars-url]: https://github.com/34fame/conflux/stargazers
[issues-shield]: https://img.shields.io/github/issues/34fame/conflux
[issues-url]: https://github.com/34fame/conflux/issues
[license-shield]: https://img.shields.io/github/license/34fame/conflux
[license-url]: https://github.com/34fame/conflux/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
