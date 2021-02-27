const fetch = require('node-fetch');
var url = require("url");

//images-api.nasa.gov URL --
const keywords = "Mars 2020";
const center = "JPL";
const description = "Perseverance image";
const secondaryCreator = "NASA/JPL-Caltech";
const title = "Perseverance";
const yearStart = "2021";

const imagesUrl = `https://images-api.nasa.gov/search?keywords=${keywords}&center=${center}&description=${description}&secondary_creator=${secondaryCreator}&title=${title}&year_start=${yearStart}`;
const imagesUrlPromise = fetch(imagesUrl.replace(/ /i, "%20"));
//--
//mars.nasa.gov URL --
const marsUrl = `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=10&order=sol+desc&&search=|FRONT_HAZCAM_RIGHT_A|FRONT_HAZCAM_RIGHT_B|FRONT_HAZCAM_LEFT_A|FRONT_HAZCAM_LEFT_B|REAR_HAZCAM_LEFT|REAR_HAZCAM_RIGHT&&extended=sample_type::full,%20sample_type::thumbnail,%20product_type::raw,%20product_type::color`;
const marsUrlPromise = fetch(marsUrl);
//--

Promise.all([imagesUrlPromise, marsUrlPromise]).then(
    //fetchResponses is an array of no-json body objects. Body.json() returns a Promise too. 
    //Therefore, we need to wait the response of each json function via Promise.all again 
    fetchResponses => Promise.all(fetchResponses.map(body => body.json()))).then(
        // Finally, we have an array of JSON objects
        bodyJsonArray => {
            const finalArray = [];
            bodyJsonArray.forEach(bodyJson => {
                if (bodyJson.collection) {
                    const hostname = url.parse(bodyJson.collection.href).hostname;
                    bodyJson.collection.items.forEach(item => {
                        const { title, date_created } = item.data[0];
                        finalArray.push({ hostname, title, date: date_created, url: item.links[0].href });
                    })
                } else {
                    bodyJson.images.forEach(item => {
                        const hostname = url.parse(item.json_link).hostname;
                        const { title, date_received, image_files } = item;
                        finalArray.push({ hostname, title, date: date_received, url: image_files.small });
                    })
                }
            });
            console.log(finalArray);
        }
    );

