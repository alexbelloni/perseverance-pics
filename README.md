# Perseverance Pics

The space subject these days is "Perseverance Landing". This amazing rover, which landed on Mars on February 2021, has sent lots of images from that red planet via its 23 cameras. It's an awesome demonstration of the use of NASA's technologies. In October 2021, Space Apps Challenge will be ready for hackers worldwide. Surely, the rover's journey will be mentioned as a theme of that international hackathon. Therefore, "Perseverance Pics" is one of the possible applications joining space and accessible technologies. In other words, we can use NASA APIs and computer languages to create our projects.    

Perseverance Pics presents images of Mars by the rover.

[Demo](https://alexbelloni.github.io/Perseverance-Pics/)

## Which APIs and languages will we use? 🤔

In my [other project](https://nasadatanauts.github.io/alexbelloni/pages/asteroidnn4.html), I presented the "Asteroids - NeoWs", a RESTful web service by NASA. That one gives us details about near earth Asteroid information. In that case, I used it to check information about an asteroid that could be as big as the CN Tower, a Canadian iconic building, and hurtle past near Earth.  
However, "Perseverance Pics" will get images from NASA using the **NASA Image and Video Library** and the **NASA RSS Feed of Raw Images**.  
It will show information using JavaScript as language. 

## 1. NASA Image and Video Library

URL base: images-api.nasa.gov  
Pathname: search  
Parameters:
| Name | Description |
| --- | --- |
| keywords | One or more terms separated with commas |
| center | NASA center which published the media |
| description | Description of the image | |
| secondary_creator | A secondary photographer/videographer’s name |
| title | Terms to search for in “Description” fields |
| year_start | The start year for results. Format: YYYY |

For instance:

https://images-api.nasa.gov/search?keywords=Mars%202020&center=JPL&description=Perseverance%20image&secondary_creator=NASA/JPL-Caltech&title=Perseverance&year_start=2021

Relevant part of the response (for our purpose):

``` json
{
    "collection": {
        "href":"",
        "items": [
            {
                "data": [
                    {"title":"", "date_created":""}
                ], 
                "links":[
                    {"href":""}
                ]
            }
        ]
    }
}

```

## 2. NASA RSS Feed of Raw Images

URL base: mars.nasa.gov   
Pathname: /rss/api  
Parameters:
| Name | Description |
| --- | --- |
| feed | Feed name |
| category | Category name |
| feedtype | Type of the return | |
| num | Quantity of the images per page |
| order | descendent per sol |
| search | which engineering cameras separated with bars |

For instance:

https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=10&order=sol+desc&&search=|FRONT_HAZCAM_RIGHT_A|FRONT_HAZCAM_RIGHT_B&&extended=sample_type::full

Relevant part of the response (for our purpose):

``` json
{
    "images": [
            {
                "json_link": "",
                "title": "",
                "date_received": "", 
                "image_files": { "small":"" }
            }
        ]
}

```
## Coding the first test using Node

First of all, we will create a Node file named node-request.js.   
Install node-fetch to request the API response:  
```code
npm install --save node-fetch  
```

The complete request-response could be:  

```javascript
const fetch = require('node-fetch');

const url = "https://images-api.nasa.gov/search?keywords=Mars%202020&center=JPL&description=Perseverance%20image&secondary_creator=NASA/JPL-Caltech&title=Perseverance&year_start=2021";
const imageApiPromise = fetch(url);

Promise.all([imageApiPromise]).then(
    //fetchResponses is an array of no-json body objects. Body.json() returns a Promise too. 
    //Therefore, we need to wait the response of each json function via Promise.all again 
    fetchResponses => Promise.all(fetchResponses.map(body => body.json()))).then(
        // Finally, we have an array of JSON objects
        bodyJsonArray => bodyJsonArray.forEach(bodyJson => {
            bodyJson.collection.items.forEach(item => {
                console.log("title:", item.data[0].title, "date:", item.data[0].date_created, "url:", item.links[0].href);
            })
        })
    );
```

Here is the [complete file](./node-request.js).

## Coding a website using JavaScript 

The version of the JavaScript file for web (using Web APIs) is very similar and it is in the webapis-request.js, [here](./webapis-request.js).  
This file can be used in a simple HTML file like the index.html.  
  
Finally, the [demo](https://alexbelloni.github.io/Perseverance-Pics/). 
🚀

## References

https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf  
https://mars.nasa.gov/mars2020/multimedia/raw-images/

