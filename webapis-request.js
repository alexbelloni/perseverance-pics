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
const marsUrl = `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=49&page=0&order=sol+desc&&search=|REAR_HAZCAM_RIGHT|REAR_HAZCAM_LEFT|FRONT_HAZCAM_RIGHT_A|FRONT_HAZCAM_RIGHT_B|FRONT_HAZCAM_LEFT_A|FRONT_HAZCAM_LEFT_B|NAVCAM_RIGHT|NAVCAM_LEFT|MCZ_RIGHT|MCZ_LEFT&&extended=sample_type::full,`;
const marsUrlPromise = fetch(marsUrl);
//--

Promise.all([imagesUrlPromise, marsUrlPromise]).then(
    //fetchResponses is an array of no-json body objects. Body.json() returns a Promise too. 
    //Therefore, we need to wait the response of each json function via Promise.all again 
    fetchResponses => Promise.all(
        fetchResponses.filter(fr => fr.status === 200) //just valid responses
            .map(body => body.json()))).then(
                // Finally, we have an array of JSON objects
                bodyJsonArray => {
                    const finalArray = [];
                    bodyJsonArray.forEach(bodyJson => {
                        if (bodyJson.collection) {
                            const hostname = new URL(bodyJson.collection.href).hostname;
                            bodyJson.collection.items.forEach(item => {
                                const { title, date_created } = item.data[0];
                                finalArray.push({ hostname, title, date: new Date(date_created), url: item.links[0].href });
                            })
                        } else {
                            bodyJson.images.forEach(item => {
                                const hostname = new URL(item.json_link).hostname;
                                const { title, date_received, image_files } = item;
                                finalArray.push({ hostname, title, date: new Date(date_received), url: image_files.small });
                            })
                        }
                    });

                    document.querySelector('#images').innerHTML = finalArray.sort((a, b) => b.date - a.date).map(img => (
                        `<article class="card">
                    <img src="${img.url}"/>
                    <span class="title">${img.title}</span>
                    <div class="details">
                        <span class="info">${img.hostname}</span>
                        <span class="info">${img.date.getFullYear()}-${padStart(img.date.getMonth() + 1)}-${padStart(img.date.getDate())}</span>
                    </div>
                </article>`
                    )).join('');

                    function padStart(number) {
                        return number.toString().padStart(2, '0');
                    }
                }
            );

