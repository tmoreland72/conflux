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
    <img src="client/public/icons/favicon-96x96.png" alt="Logo" width="96" height="96">
  </a>

  <h3 align="center">Conflux</h3>

  <p align="center">
    Conflux is a personal writing/documenting tool, inspired by Atlassian's Confluence.  It is a full-stack application using Quasar Framework (Vue.js) for the client and Node.js/Express.js for the server.  Both the client and server are built to run in Google Firebase.
    <br />
    <a href="https://github.com/34fame/conflux/wiki" _target="blank"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/34fame/conflux" _target="blank">View Demo</a>
    ·
    <a href="https://github.com/34fame/conflux/issues" _target="blank">Report Bug</a>
    ·
    <a href="https://github.com/34fame/conflux/issues" _target="blank">Request Feature</a>
  </p>

  <p align="center">
   <a
      href="https://conflux.34fame.com"
      _target="blank"
      style="background-color: #FD7014; border: none; border-radius: 8px; color: white; padding: 15px 32px; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer;"
   >
      Open Conflux
   </a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Startup](#startup)
- [Basic Usage](#basic-usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

Conflux is a work in progress. The purpose for starting this project was the desire for a better writing tool at a low/no cost.

<!-- ### First Glance Demo

[![Conflux](http://img.youtube.com/vi/_OBhCYtlMiA/0.jpg)](http://www.youtube.com/watch?v=_OBhCYtlMiA "Conflux - First Glance") -->

<!-- GETTING STARTED -->

## Getting Started

What you will need to get started:

-  Quasar Framework

   ```bash
   npm i -g @quasar/cli
   ```

-  Firebase account

   -  Create a new project
   -  Install tools

   ```bash
   npm i -g firebase-tools
   ```

-  Algolia account
   -  Create a new app
   -  Create a new index

### Installation

-  Clone the repo

   ```sh
   git clone https://github.com/34fame/conflux
   ```

-  Install packages

   ```sh
   cd conflux
   yarn

   cd client
   yarn
   cd ..

   cd server/functions
   yarn
   cd ../..
   ```

-  Copy the environment variables template file and update with your Firebase and Algolia information

   ```sh
   cd client
   cp .quasar.env_template.json .quasar.env.json
   ```

-  Initialize the client for Firebase

   ```sh
   cd conflux/client
   firebase init

   # Select the Hosting service
   ```

-  Initialize the server for Firebase

   ```sh
   cd conflux/server
   firebase init

   # Do NOT let the process overwrite `index.js`.
   ```

-  Export service account from Firebase as `conflux/server/functions/services/firebase/service-account.json`

### Startup

There are several scripts available in the project, client and server package.json files to assist with starting up Conflux for different scenarios. The easiest is to run everything locally using Firebase emulators.

```bash
# From the project root directory
yarn serve:local
```

If this loads successfully, you should see Conflux open in your browser at http://localhost:8080. You can open the Firebase emulator dashboard at http://localhost:4000. This will give you visibility of the Firest and Cloud Function services now running on your machine.

WARNING: Running locally with emulators means no data will be saved. You will have to deploy your client and server to Firebase and run against that environment for data to remain.

<!-- USAGE EXAMPLES -->

## Basic Usage

-  Conflux is a personal documentation workspace. Individuals register with minimal information and authenticate with email and password.

-  Authenticated users can then manage their own books. Inside books are chapters and inside chapters are pages.

-  Page content uses [markdown syntax](https://www.markdownguide.org/) with an embedded editor with VSCode basic capabilities (e.g. search and replace).

-  The [Mermaid.js plugin](https://mermaid-js.github.io/mermaid) is available to building graphical diagrams in markdown syntax.
-

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/34fame/conflux/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**. Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) when creating commit messages.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Troy Moreland - Graypes#3890 - Discord

Project Link: [https://github.com/34fame/conflux](https://github.com/34fame/conflux)

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
