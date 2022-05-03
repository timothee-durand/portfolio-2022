---
title: Les lignes du temps
subtitle: Collective Project | History Search Engine
thumbnail: /project-images/ldt.png
role:
  - Web developper
year: 2020
type:
  - School Project
link: https://timotheedurand.fr
techs:
  - WordPress
---

### Pitch

The lines of time in english. The purpose of this project was to create an search engine who provide result of a
history search as a timeline. For example, when you search "World War 2" the application will give you a timeline with
all the events of the database who is in relation to this term. At the end we wanted our application to be
self-suffisant : the events was take to Wikipedia through Wikipedia's API and the user help too by contributing. We were
a team of three, and I take care of a big part of the development.

### Techs

It was one of our teacher's idea, and with the idea come a constraint : WordPress. So we use WordPress with CPTUI (
Custom Post UI) and ACF (Advanced Custom Fields) to create personalized type of contents, and a JS library, TimelineJS
to show the event as a timeline. As TimelineJS takes data as JSON, we use WordPress REST API to retrieve the content and
a PHP script to transform the JSON into a good format. It's maybe not the good way to do it but finally the research
works, it returns a timeline and the users can contribute.

### Process

We started the process of creation by a long period of philosophical reflection : what represent an event,
what type of event exists, if we have a lot of event how to choose witch one to show... to conceive our database. Then
come another period of reflection : how to represent the timeline (vertically/horizontally), how to represent the
beginning of a period of time, how to represent an event with an imprecise date... to design the website. And in
parallel we think of the marketing, the communication, the budget... Then the realization : we first made a static
landing page, to talk about the project and the functionality, and finally we developed the application.
