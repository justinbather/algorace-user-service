# Project Title

## Overview

AlgoRace - A multiplayer algorithmic programming platform.

### Problem

Leetcode is good but after a while it starts to get streneous not being able to collaborate or do it alongside friends. AlgoRace lets users
solve data structures and algorthims on their own, or against friends.

### User Profile

The target audience is younger software engineers, those either learning to solve DSA's, preparing for job interviews, or those who just enjoy them

### Features

AlgoRace boasts a completely custom compiler utilizing a containerized and distributed architecture allowing us to safely compile and test user code. 

Users can either solve problems of their choosing in 'Solo/Practice' mode or in a lobby setting with 'Challenge' mode. 

When in either practice or challenge mode, the user can select their preferred language, although defaulted to JavaScript.

## Implementation

### Tech Stack

AlgoRace, built using a microservice architecture is built with Node, Docker, RabbitMQ, Bash, SocketIO, MongoDB and React.

The system has been designed with high availability, security, and speed in mind. AlgoRace utilizies 3 services total. 

- User Service: Handles all authentication, socket server, displaying of data
- Manager Service: Is the first reciever of a request to compile code. This creates a CompileJob, places the job into the task queue, and returns the
jobId to the client for polling
- Worker Service: The worker is subscribed to the task queue and is detached from the manager, only communicating through the queue. We did this
so as concurrent requests to compile grow, we can horizontally scale easily since we don't have any direct links from Manager - Worker. The worker spins up
a Docker container with the users code and everything else needed, which runs a Bash script that runs the users code. Upon completion, the Worker sends a request
to the manager with the stderr or stdout and jobId.

### APIs

N/A

### Sitemap

Login - User can login or click to create an account
Sign up - Linked on Login, users can create an account
Home - Users can start a Challenge lobby, join one, or start up a practice session
Practice - Users can select a problem and complete it in our editor
Challenge Lobby - Users can ready/unready themselves, when all ready, the host can start the match
Challenge - Users in lobby are all given the same problem to solve each round


### Mockups

Provide visuals of your app's screens. You can use tools like Figma or pictures of hand-drawn sketches.

### Data

Describe your data and the relationships between them. You can show this visually using diagrams, or write it out. 

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

### Auth

Yes, using JWT and stored in user cookies

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation. Think about what you can reasonably complete before the due date. The more detail you provide, the easier it will be to build.

## Nice-to-haves

Your project will be marked based on what you committed to in the above document. Under nice-to-haves, you can list any additional features you may complete if you have extra time, or after finishing.
