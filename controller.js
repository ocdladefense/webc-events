import renderEvents from "./components.js";
import testData from "./data.js";
import { HttpClient } from "./dev_modules/http/HttpClient.js";
import { HttpCache } from "./dev_modules/http/HttpCache.js";
import { GoogleApisCalendarMock } from "./dev_modules/mock/GoogleApisCalendarMock.js";
import { Url } from "./dev_modules/http/Url.js";
export default init;
export { init };




function queryByDateRange(start, end) {

    // built-ins
    let calendarId = "biere-library@thebierelibrary.com";
    let url = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/event?fu=bar";
    url = new Url(url);
    //url = url + "?" + "timeMin=" + start + "&timeMax=" + end;
    url.buildQuery("timeMin", start);
    url.buildQuery("timeMax", end);
    url.buildQuery("TEST");

    return url.toString();

}
window.query = queryByDateRange;

const cache = new HttpCache(testData);
const config = { cache: cache };
const client = new HttpClient(config);
/*
const url = queryByDateRange("2023-07-01", "2023-07-15");
const invalidUrl = queryByDateRange("2023-06-31", "2023-07-15");
client.register("www.googleapis.com", new GoogleApisCalendarMock(url));
const req = new Request(url);
*/
// Pretending what the current environment looks like for this machine/application.
const env = {
    today: "2023-06-30",
    season: "spring",
    weather: "mostly sunny",
    city: "Corvallis, OR"
};


async function init() {
    let url = queryByDateRange("2023-07-01", "2023-07-15");
    const invalidUrl = queryByDateRange("2023-06-31", "2023-07-15");
    HttpClient.register("www.googleapis.com", new GoogleApisCalendarMock());

    let nextDate = new Date(env.today);
    nextDate.setDate(nextDate.getDate() + 1);
    let dateString = nextDate.toISOString().substring(0, 10);


    if (this.id == "button") {
        url = queryByDateRange(env.today, env.today);
    }

    if (this.id == "tomorrow") {
        url = queryByDateRange(env.today, dateString);
    }

    if (this.id == "invalid") {
        url = invalidUrl;
    }

    const req = new Request(url);

    const resp = await client.send(req);
    // fetch(url);
    resp.json()
        .then(events => {
            if (events.error) {
                throw new Error(events.error);
            }
            console.log(events);
            const eventsContainer = document.getElementById('events');
            eventsContainer.innerHTML = renderEvents(events);
        })
        .catch(error => {
            alert('Error: ' + error.message);
            console.error('Error: ', error);
        });
}