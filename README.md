# Technical Showcase: Photo Album

You may notice a ".devcontainer" folder in this repo. Rejoice! This means that replicating the same environment I used when developing this is on your machine is just mere moments away.

**Here's what you need to do to get up and running:**

- Make sure you have Docker installed and running on your machine, and add the "Dev Containers" extension to VS Code.
- In VS Code, run the command "Dev Containers: Clone Repository in Container Volume..." You can do so by opening the command pallette and search for the command, or click the "Remote menu" in the lower-left corner of VS Code and you should see the "Clone Repository in Container Volume..." command appear
When prompted for the repository url, paste this repo's url: https://github.com/cabarney/lt-photo-album.git
- A docker image will be created that contains everything you need. It will:
  1) clone the source
  2) install the Angular CLI
  3) install a headless Chrome browser for use with running the tests
  4) install all needed npm packages
  5) configure VS code with the extensions and settings needed for working with the code efficiently
- When the post-start script has finished running (it may take a minute or two depending on your network speed), you should be able to open a terminal prompt within VS Code and run `npm run start` to launch the site, or `npm run test` to run the tests.
- When serving the site, a port will be forwarded automatically from the dev container running in Docker to your local machine, so you'll be able to visit the site on your local machine at http://localhost:4200/


[Learn more about DevContainers](https://code.visualstudio.com/docs/devcontainers/containers)

You may still be able to launch the site without using dev containers, but this is assuming that you have your local machine configured similarly to what was used to develop this in the first place. Run `npm install` followed by `npm run start` to start the site locally.