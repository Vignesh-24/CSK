const FETCH_URL = "https://www.chennaisuperkings.com/SBBE/contestGroup/getContestGroupById/1";
const UPDATE_URL = "https://www.chennaisuperkings.com/SBBE/quizAnswer/updateContestPoint";
const CREATE_URL = "https://www.chennaisuperkings.com/SBBE/quizTotalAnswer/createUserData";

Object.defineProperty(Date.prototype, 'YYYYMMDDHHMMSS', {
    value: function() {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        return this.getFullYear() + '-' +
               pad2(this.getMonth() + 1) + '-'+
               pad2(this.getDate()) + ' '+
               pad2(this.getHours()) + ':' +
               pad2(this.getMinutes()) + ':' +
               pad2(this.getSeconds());
    }
});

const quizzes_req = fetch(FETCH_URL, {method:'GET',credential: 'same-origin'});
var data = await Promise.all([quizzes_req])
const quizzes = await data[0].json();

var quiz_data = quizzes.data.contestEntity.map(
    val => ({'code':val.contestCode, 'id':val.contestId, 'title': val.contestTitle, 'ansKey': val.contestquestions.map(
        q => ({'questionId':q.contestQnId, 'answerId':q.contestAnswersEntity
        .find(ele => ele.isCorrectAnswer == 'Y').contestAnsId}))
    })
);

async function startQuiz(index) {
    var cur_quiz = quiz_data[index];
    var create_user_payload = {
        userId: "<<userid>>",
        quizCode: cur_quiz.code,
        quizId: cur_quiz.id,
        lastQuestionAnswer: 0,
        totalCorrectAnswered: 0,
        points: 0
    }

    var header_data = {
        "Content-Type": "application/json",
        "Content-Length": 256,
        "Accept": "application/json, text/plain, */*"
      }

    var create_user = await fetch(CREATE_URL, 
        {method:"POST", body: JSON.stringify(create_user_payload), credential: 'same-origin', headers: header_data});
    var res = await create_user.json();
    console.log(res);

    var answerKey = cur_quiz.ansKey;
    var startdate = new Date();
    var endDate = new Date();
    endDate.setSeconds(startdate.getSeconds()+1);

    for(let i=0; i < answerKey.length; i++) {
        var payload = {
            userId: "<<userid>>",
            answerId: answerKey[i].answerId.toString(),
            questionId: answerKey[i].questionId,
            quizCode: cur_quiz.code,
            completedTime: startdate.YYYYMMDDHHMMSS(),
            totalPoints: "15000",
            totalSeconds: 25,
            answeredSeconds: 25,
            penaltyPerSecond: "-10",
            quizId:cur_quiz.id.toString(),
            startTime: startdate.YYYYMMDDHHMMSS()
          }
   
        var res = await fetch(UPDATE_URL, 
            {method: 'POST', credential: 'same-origin', body:JSON.stringify(payload),
            headers: header_data});
        var result = await res.json();
        console.log(result);
    }
}

