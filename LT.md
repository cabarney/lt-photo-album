# Technical Showcase: Photo Album
## Overview
As I am after something more than just an individual contributor engineer role, I'm not going to approach this as a simple task of writing a simple web page. If you're judging me on my ability to code a simple UI around an API you're evaluating the wrong things about me. So I'm going to approach this as a principle engineer or architect (though I still will code the solution as well).

## Requirements
Create either a console or a UI application that displays photo ids and titles in an album. 
The photos are available in this web service: https://jsonplaceholder.typicode.com/photos. Photos are filtered with a query 
string. This will return photos within Album ID 3: https://jsonplaceholder.typicode.com/photos?albumId=3.

- You can use any language or framework.
- You can use any open source libraries.
- Automated tests are encouraged.
- Post your solution on a free repository such as GitHub and send us a link.
- Provide a README that contains instructions on how to build and run your application.
- Spend as much (or little) time as you’d like on this.
- Feel free to use any resources available.

For a Console application, an example input and output could look like this (but feel free to get more creative):

photo-album 2
[53] soluta et harum aliquid officiis ab omnis consequatur
[54] ut ex quibusdam dolore mollitia

For a UI application, you could have an optional Album ID input and display the results (but feel free to get more creative).

### Context
I will be taking the UI Application approach. These requirements have simply been thrown over the wall - I'm treating them as if there is no business stakeholder, PO, or architect of this photo api to ask questions of. However, if there were, I would have lots of questions. Let's talk about that.

### Questions (and concerns)
#### Audience
The first thing that I'm wondering about is the audience of this application. Is this a local, private photo store, or is it more likely a open (public or company internal)-facing website that allows photo browsing? The answer here would affect many aspects of the design, authentication and authorization in particular.

There is also no mention of anticipated traffic levels or anticipated size of the photos collection. This will be mentioned again later.

#### Authentication and Authorization
There is no mention of auth requirements. This is something I would certainly want to dig in to more with stakeholder and product teams. If this is a public site that allows users to upload photos in to albums, there would potentially need to be auth around how accessible an album or particular photo is. Even if there are no strictly-enforced auth requirements, we might want to implement some sort of security through obscurity by doing away with the auto-incrementing integer IDs (more on this in a sec)

#### Albums
There is no provided Albums API endpoint. The requirements state that we can optionally enter a album ID to view the photos in a particular album, but this requires the user to know the ID of an album. In general, this is not a good user experience. Better would be the ability to browse albums (subject to any necessary auth restrictions).

Given just the photos API, browsing albums is not possible without retrieving the entire list of photos and grouping by albumId. If the size of the photos database is never going to be larger than it is in the mock API in the requirements, this isn't a big deal (5000 photos, ~135k). If the actual service can grow to containing millions (or billions) of photos, it becomes more problematic to do album grouping (but not impossible)

The approach would look something like this:

- Introduce a BFF which will fetch the entire collection and cache a list of albums
  - If the collection is small, we can cache the entire payload grouped by albumId
  - If the collection is huge, better would be to just cache the list of albums. However, if the collection is huge, we have other issues as well - namely the fact that there is no pagination on the API - it's all or nothing.
- The BFF would then have an albums endpoint to allow fetching a list of albums, as well as endpoints for the photos in a given album and a stream of all the photos (depending on the unspecified auth requirements)

Risks of this approach:

- Stale data. With a relatively small size, we could refresh that cache from the server fairly frequently - maybe even every 30-60 seconds (assuming the API is even a little robust and not running on someone's smartwatch or something - more on this later). But even so, there will be that 30-60s period where a photo or album exists and it will not appear on the site. 
- Lack of pagination on the API: if the photo collection is going to be HUGE, the lack of pagination on the API is going to be a problem. It would mean that we would probably need to scale back the frequency of fetching the data, and potentially move that into a separate service or daemon and have that push the album information to a cache (reddis, or something similar)

#### Caching
Not knowing the anticipated load of this site it's hard to determine what (if any) caching strategies should be used. If heavy traffic is expected, caching of API responses in a BFF layer may be advisable. This comes with the same risk of stale data as caching album data in the BFF above.

#### IDs
We're able to filter the photos from the API using an album id, which appears to be an auto-incremented integer. IDs such as these are ok in some cases - especially in internal apps, or for data with no permissions applied to them. However, for most "real-world" applications simple IDs like these can be problematic. It allows malicious users to understand too much about how our data is structured and can make it easier for them to target information they do not have access to. I have permission to look at album ID 34... I wonder if I can access album ID 35?

Using something like a GUID for and ID helps with this - security by obscurity. The album I have access to is album id 0b965c83-2f66-4346-abf7-87493f462b64... I have no idea how to guess the id of another album. 

The downside to GUIDs is that URLs are rather ugly. This isn't much of an issue if it is limited to the API or BFF layer. The front-end doesn't necessarily need to include that id in the url. If a deep link is desired, other measures could be taken. (we're getting way outside the defined requirements now, but albums could have names that could be slugified to provide a deep link url - myphotos.com/my/albums/class-field-trip. This would mean that the API or BFF would need to have more than just an ID for an album from somewhere, and know the mapping of a user + album slug to a unique album id)

All this to say that simple numeric ids can be a vulnerability and should be considered.


## Deployment
If a BFF layer is not needed, the pre-built angular app bundle could simply be deployed to an AWS S3 bucket or equivalent. A Route54 record would be required if we wanted to put a nice URL in front of it.

If, after further refinement of the requirements, a BFF layer is needed, a good choice there would be to dockerize the BFF application and deploy it to ECS with auto-scaling enabled, Route53 records and a load balancer in front of it.

If a non-in-memory cache is needed, Reddis or something similar could also be stood up in AWS. Additional networking configurations would likely be necessary as well. An alternative would be to use Kubernetes and deploy both the BFF and cache to a EKS cluster, but this is likely overkill.

## About the implemented solution...
So, with all that said, since I'm not able to dig deeper into the requirements for additional clarity, I'm going to apply the YAGNI principal here and do the minimum to satisfy the requirements as written. Well, *almost* as written. I'm adding a couple extra pieces of flair:

- Pagination
- A out-of-the box UI library to make things look a little better (this would certainly be a placeholder until UX provides us with an approved design)
- Dev Containers - it's the new hotness. The end of the "Works on my machine" days... Dev Containers allow you to describe a development environment with code and store it with the code itself. This allows anyone with VS Code and Docker to check out the repo and have an environment setup identical to the one all the other engineers are using. This includes CLI tools, dependencies, VS Code extensions and configuration, etc. Start the dev container and you're ready to go.
- Cypress e2e tests
