var inquirer = require("inquirer");
var axios = require("axios");
var electron_html_to = require("electron-html-to");
var fs = require("fs");

inquirer.prompt([
    {
        type: "input",
        message: "What is your favorite color?",
        name: "color",
    },
    {
        type: "input",
        message: "What is your GitHub username?",
        name: "username",
    }
]).then(function (answers) {
    axios.get(`https://api.github.com/users/${answers.username}`).then(function (response) {
        console.log(response.data);
        response.data.color = answers.color;
        return response.data;
    }).then(function (githubData) {
        axios.get(`https://api.github.com/users/${answers.username}/starred`).then(function (starResponse) {
            githubData.stars = starResponse.length;
            html(githubData);
        });
    });
});

// var conversion = convertFactory({
//     converterPath: convertFactory.converters.PDF
//   });
  
//   function pdf(){
//   conversion({ html: htmlCode }, function(err, result) {
//     if (err) {
//       return console.error(err);
//     }
   
//     // console.log(result.numberOfPages);
//     // console.log(result.logs);
//     // result.stream.pipe(fs.createWriteStream('/path/to/anywhere.pdf'));
//     // conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
//   });
// };
    function html(data) {
        var htmlCode = `
    <head> <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></head>
    <style>.top{background-color:${data.color};
     text-align:center;
    color:white;}
    .body{background-color:${data.color};
    text-align:center;}
    .repos{float:right;}
    .followers{float:left;}
    .stars{float:right;}
    .following{float:left;}</style>
    <div class=top>
    <h1>${data.login}</h1>
    <p>${data.bio}</p>
    <p>${data.company}</p>
    <p>${data.location}</p>
    <p>${data.url}</p></div>


    <div class=body>
    <div class="jumbotron">
    <div class=repos>
    <p>Number of Repositories</p>
    <p class="lead">${data.public_repos}</p>
 </div> 
</div>
<div class="jumbotron">
<div class=followers>
<p>Followers</p>
  <p class="lead">${data.followers}</p>
  
</div>
</div>
<div class="jumbotron">
<div class=stars>
<p>Stars</p>
  <p class="lead">${data.stars}</p>
 </div> 
</div>
<div class="jumbotron">
<div class=following>
<p>Following</p>
  <p class="lead">${data.following}</p>
 </div> 
</div>
</div>`
        fs.writeFileSync("./index.html", htmlCode)
        return htmlCode
        // return pdf
    }
    
