const pdf = require("pdf-creator-node");
const breakArr = require("@encodix/chunkify");
const fs = require("fs");

exports.create = (req, res) => {
  let users2 = req.students;
  let cmpArray = req.body;
  console.log(users2);
  //   let users = breakArr(req.body, 5);
  let users;
  let user1 = [];
  users2.map((data) => {
    user1.push(data._doc);
  });
  let finalData = user1.map((a, i) => {
    const dt = {
      rollNo: a && a.rollNo,
      stdName: a && a.stdName,
      admissionNo: a && a.admissionNo,
      class: a && a.class.name,
      section: a && a.section.name,
      whatsappNo: a && a.whatsappNo,
      smsNo: a && a.smsNo,
      mobileNo: a && a.mobileNo,
      religion: a && a.religion,
      fatherName: a && a.parentsInfo.father.name,
      fatherJob: a && a.parentsInfo.father.job,
      fatherEducation: a && a.parentsInfo.father.education,
      fatherCnic: a && a.parentsInfo.father.cnic,
      fatherContact: a && a.parentsInfo.father.contactNo,
      motherName: a && a.parentsInfo.mother.name,
      motherJob: a && a.parentsInfo.mother.job,
      motherEducation: a && a.parentsInfo.mother.education,
      motherCnic: a && a.parentsInfo.mother.cnic,
      motherContact: a && a.parentsInfo.mother.contactNo,
      guardianName: a && a.guardian.guardian.name,
      guardiaEmail: a && a.guardian.guardian.email,
      guardianContact: a && a.guardian.guardian.contactNo,
      guardianJob: a && a.guardian.guardian.job,
      guardianCnic: a && a.guardian.guardian.cnic,
      guardianEducation: a && a.guardian.guardian.education,
    };
    return dt;
  });
  console.log(finalData);
  if (cmpArray.length != 0) {
    const newFilterStudent = finalData.map((newData) => {
      const obj = {};
      cmpArray.forEach((item) => {
        obj[item] = newData[item];
      });
      return obj;
    });
    users = breakArr(newFilterStudent, 15);
  } else {
    users = breakArr(finalData, 15);
  }
  console.log(users);
  const options = {
    format: "Tabloid",
    orientation: "landscape",
    border: "0",
    timeout: 1800000,
  };
  const html = `
  <html>
  <head>
  <style>
      .item {
        display: inline-block;
        position: relative;
        // height: 100px;
        align-self: center;
      }
      .logo {
        left: 0;
        width: 100px;
        vertical-align: middle;
      }
      .schoolName {
        left: 300px;
        font-size: 24px;
      }
      .date{
      left:600px;
      }
      .signDiv{
          position: relative;
          left: 980px;
          top: -1px;
          width: 50px;
          right: 12px;
          height: fit-content;
          font-size: 15px;
          color: black;
      }
      .footer{
        position: relative;
        top:50px;
      }
      body{
        padding:20px;
      }
  </style>
  </head>
  <body>
${users
  .map(
    (user, i) =>
      `
      <header>
      <div class="header">
        <div class="item logo">
          <img
            src="https://ghazalians.com/static/media/logo.feb4793d3dade69a38ea.png"
          />
        </div>
        <div class="item schoolName"><h2>Ghazali Educational Complex</h2></div>
        <div class="item date">Date: 12/30/2002</div>
      </div>
      <div class="item0" style="margin-top: 10px; margin-left: 10px">
        <label for="listName">List Name</label
        ><input
          style="border: none; border-bottom: 1px solid black"
          type="text"
          id="listName"
        />
      </div>
    </div>
    </header> 
      <table style="border:1px solid black;margin-top: 30px;border-collapse: collapse;width:100%;>
      <thead style="font-size: 10px;">
        <tr style="width: 5%;">
        <th style='border:1px solid black; width: 3%; font-size: 10px;text-align: left;'>Sr#</th>
          ${Object.keys(user[0])
            .map(
              (item) =>
                `<th style='border:1px solid black; width: 5%; font-size: 10px;text-align: left;'>${item}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${user
          .map(
            (item, i) =>
              `<tr style='width: 5%; font-size: 10px;'><td style='border:1px solid black;width: 3%;'>${
                i + 1
              }</td>
              ${Object.keys(user[0])
                .map(
                  (key) =>
                    `<td style='border:1px solid black;width: 5%;'>${item[key]}</td>`
                )
                .join("")}</tr>`
          )
          .join("")}
      </tbody>
    </table>
    <footer style="position:realtive; bottom:0;page-break-after:${
      i === users.length - 1 ? "avoid" : "always"
    };">       <div class= "footer" style="display: flex; justify-content: space-between">
      <div class="item">
        <label for="remarks">Remarks</label>
        <input
          style="border: none; border-bottom: 1px solid black"
          type="text"
        />
      </div>
      <div
      class="item signDiv"
      >
        <img
          src="https://ghazalians.com/static/media/sign.fa4f2498246741139bb8.png"
          style="width: 50px; margin-bottom: 0px"
        />
        Principal
      </div>
    </div></footer>

    `
  )
  .join("")}
</body>
</html>
`;
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: `./pdf/${Math.random().toString(36).slice(2, 8)}.pdf`,
    type: "",
  };
  pdf
    .create(document, options)
    .then((ress) => {
      console.log(ress);
      let a = ress.filename;
      res.download(a);
      const del = () => {
        fs.unlink(a, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        });
      };

      setTimeout(del, 600000);
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(users);
};

exports.createPicPdf = (req, res) => {
  let users2 = req.students;
  let cmpArray = req.body;
  //   let users = breakArr(req.body, 5);
  let users;
  let user1 = [];
  users2.map((data) => {
    user1.push(data._doc);
  });
  let finalData = user1.map((a, i) => {
    const dt = {
      pic: typeof a.pic === "undefined" ? "" : a.pic,
      rollNo: a && a.rollNo,
      stdName: a && a.stdName,
      admissionNo: a && a.admissionNo,
      class: a && a.class.name,
      section: a && a.section.name,
      whatsappNo: a && a.whatsappNo,
      smsNo: a && a.smsNo,
      mobileNo: a && a.mobileNo,
      religion: a && a.religion,
      fatherName: a && a.parentsInfo.father.name,
      fatherJob: a && a.parentsInfo.father.job,
      fatherEducation: a && a.parentsInfo.father.education,
      fatherCnic: a && a.parentsInfo.father.cnic,
      fatherContact: a && a.parentsInfo.father.contactNo,
      motherName: a && a.parentsInfo.mother.name,
      motherJob: a && a.parentsInfo.mother.job,
      motherEducation: a && a.parentsInfo.mother.education,
      motherCnic: a && a.parentsInfo.mother.cnic,
      motherContact: a && a.parentsInfo.mother.contactNo,
      guardianName: a && a.guardian.guardian.name,
      guardiaEmail: a && a.guardian.guardian.email,
      guardianContact: a && a.guardian.guardian.contactNo,
      guardianJob: a && a.guardian.guardian.job,
      guardianCnic: a && a.guardian.guardian.cnic,
      guardianEducation: a && a.guardian.guardian.education,
    };
    return dt;
  });
  console.log(finalData);
  if (cmpArray.length != 0) {
    const newFilterStudent = finalData.map((newData) => {
      const obj = {};
      cmpArray.forEach((item) => {
        obj[item] = newData[item];
      });
      return obj;
    });
    users = breakArr(newFilterStudent, 5);
  } else {
    users = breakArr(finalData, 5);
  }
  console.log(users);
  const options = {
    format: "Tabloid",
    orientation: "landscape",
    border: "0",
    timeout: 1800000,
  };
  const html = `
  <html>
  <head>
  <style>
      .item {
        display: inline-block;
        position: relative;
        // height: 100px;
        align-self: center;
      }
      .logo {
        left: 0;
        width: 100px;
        vertical-align: middle;
      }
      .schoolName {
        left: 270px;
        font-size: 24px;
      }
      .date{
      left:495px;
      }
      .signDiv{
          position: relative;
          left: 865px;
          top: -1px;
          width: 50px;
          right: 12px;
          height: fit-content;
          font-size: 15px;
          color: black;
      }
      .footer{
        position: relative;
        top:30px;
      }
      body{
        padding:20px;
      }
  </style>
  </head>
  <body>
${users
  .map(
    (user, i) =>
      `
      <header>
      <div class="header">
        <div class="item logo">
          <img
            src="https://ghazalians.com/static/media/logo.feb4793d3dade69a38ea.png"
          />
        </div>
        <div class="item schoolName"><h2>Ghazali Educational Complex</h2></div>
        <div class="item date">Date: 12/30/2002</div>
      </div>
      <div class="item0" style="margin-top: 10px; margin-left: 10px">
        <label for="listName">List Name</label
        ><input
          style="border: none; border-bottom: 1px solid black"
          type="text"
          id="listName"
        />
      </div>
    </div>
    </header> 
      <table style="border:1px solid black;margin-top: 30px;border-collapse: collapse;width:100%;>
      <thead style="font-size: 10px;">
        <tr style="width: 5%;">
        <th style='border:1px solid black; width: 3%; font-size: 10px;text-align: left;'>Sr#</th>
          ${Object.keys(user[0])
            .map(
              (item) =>
                `<th style='border:1px solid black; width: 5%; font-size: 10px;text-align: left;'>${item}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${user
          .map(
            (item, i) =>
              `<tr style='width: 5%; font-size: 10px;'><td style='border:1px solid black;width: 3%;'>${
                i + 1
              }</td>
              ${Object.keys(user[0])
                .map((key) => {
                  if (key === "pic") {
                    return `<td style='border:1px solid black;width: 5%;'><img src = "https://server.ghazalians.com/${item[key]}" style='width: 65px; height:65px'/></td>`;
                  } else {
                    return `<td style='border:1px solid black;width: 5%;'>${item[key]}</td>`;
                  }
                })
                .join("")}</tr>`
          )
          .join("")}
      </tbody>
    </table>
    <footer style="position:realtive; bottom:0;page-break-after:${
      i === users.length - 1 ? "avoid" : "always"
    };">       <div class= "footer" style="display: flex; justify-content: space-between">
      <div class="item">
        <label for="remarks">Remarks</label>
        <input
          style="border: none; border-bottom: 1px solid black"
          type="text"
        />
      </div>
      <div
      class="item signDiv"
      >
        <img
          src="https://ghazalians.com/static/media/sign.fa4f2498246741139bb8.png"
          style="width: 50px; margin-bottom: 0px"
        />
        Principal
      </div>
    </div></footer>

    `
  )
  .join("")}
</body>
</html>
`;
  const document = {
    html: html,
    data: {
      users: users,
    },
    path: `./pdf/${Math.random().toString(36).slice(2, 8)}.pdf`,
    type: "",
  };
  pdf
    .create(document, options)
    .then((ress) => {
      console.log(ress);
      let a = ress.filename;
      res.download(a);
      const del = () => {
        fs.unlink(a, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted");
          }
        });
      };

      setTimeout(del, 600000);
    })
    .catch((error) => {
      console.error(error);
    });
  console.log(users);
};
