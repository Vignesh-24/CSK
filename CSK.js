const FETCH_URL = "https://www.chennaisuperkings.com/FGBE/quizzes_progress";
const UPDATE_URL = "https://www.chennaisuperkings.com/fz/updatedContestsPoint";

let start = Number.parseInt(prompt("Enter Start Quiz Number", 0));
let end = start + 30;
let updated_codes = "";
console.log(start, end);

const POINTS_LIST = [12100, 12200, 12300];
const BOOST_POINTS = [12300, 12400, 12500]




async function startProcess() {
  const options =  {
    method: 'POST',
    credentials: 'same-origin'
  };
  let payload = {
    "points": 0,
    "contestCode": ""
  };
  try {
    let quizzes_progress = await fetch(FETCH_URL, options);
    let response = await quizzes_progress.json();
    let contest_codes = response.map(val => val.quiz_code);
    end = end > contest_codes.length ? contest_codes.length : end;
    for(let index = start; index < end; index++) {
      let code = contest_codes[index];
      payload.contestCode = code;
      let random = Math.floor(Math.random() * 3);
      console.log(random);
      if(index % 10 > 7) {
        payload.points = BOOST_POINTS[random];
      } else {
        payload.points = POINTS_LIST[random];
      }
      console.log(payload);
      let result = await updatePoints(payload);
      console.log(result);
      updated_codes+=payload.contestCode+","
      await sleepNow(5000);
    }
    alert(updated_codes + " Updated...!!! Next Start Number:", end ); 
  } catch (error) {
    console.log(error);
  }
}

async function updatePoints(payload){
  const options =  {
    method: 'POST',
    credential: 'same-origin',
    body: JSON.stringify(payload)
  };

  try {
    let result = await fetch(UPDATE_URL, options);
    let response = await result.json();
    return response;
  } catch (error) {
    console.log(error);
  }
 }

 const sleepNow = (delay) => new Promise ((resolve) => setTimeout (resolve, delay ));

startProcess();
