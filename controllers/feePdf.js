const pdf = require("pdf-creator-node");
// const breakArr = require("@encodix/chunkify");
const fs = require("fs");

let cdDate = (dt) => {
  const today = new Date(dt);
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedToday = dd + "/" + mm + "/" + yyyy;
  return formattedToday;
};
// voucher

exports.feePdf = {
  create2: (req, res) => {
    let users = req.voucher;
    let user = [];
    users.map((data) => {
      data.value.map((data1) => {
        user.push(data1._doc);
      });
    });
    console.log(user);
    let users2 = [];
    user.map((a) => {
      if (a !== "undefined") {
        users2.push(a);
      }
    });
    console.log(users2);
    let counter = 1;
    var options = {
      format: "Tabloid",
      orientation: "portrait",
      border: "0",
      timeout: 1800000,
    };
    const html = `
  <html>
  <head>
    <style>
        .pBox {
            width: 100%;
            display: block;
            color: black;
            margin-left: 8px;
            padding-left: 10px;
            padding-top: 20px;

        }

        header {
            margin: 0%;
            padding: 0%;
        }

        .logo {
            width: 75px;
            float: left;
            margin-top: -2px;
            margin-left: 10px;
        }

        .guardFooter {
            float: right;
            padding: 2px;
            font-size: 10px;
            margin-right: 10px;
            margin-top: 10px;
            display: block;
            font-weight: bold;
        }

        .text1 {
            text-align: center;
            margin-top: 0px;
            width: 650px;
        }

        .up {
            margin-top: -11px;
            margin-bottom: -5px;
            margin-right: 0;
        }

        .up1 {
            font-size: 10px;
            text-align: left;
            width: 208px;
            margin-top: 0;
            position: relative;
            left: 45px;
            display: inline-block;
        }

        .lastD {
            display: inline-block;
            border: 1px solid white;
            font-weight: bold;
            font-size: 10px;
        }

        .fam {
            display: inline-block;
        }

        .father {
            position: relative;
            left: 21px;
            display: inline-block;
        }

        .fatherCnic {
            position: relative;
            left: 35px;
            display: inline-block;
        }

        .father1 {
            display: inline-block;
        }

        .text2 {
            font-size: 10px;
            margin-right: -10px;
            margin-top: 8px;
            width: 645px;
            margin-left: 80px;
            text-align: center;
        }

        .pBox table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid white;
            font-size: 10px;
        }

        .pBox tr,
        .pBox td {
            border: 1px solid white;
            width: 40%;
            padding-left: 5px;
        }

        .srNo {
            width: 2% !important;
            text-align: center;
        }

        .scnd {
            width: 10% !important;
        }

        .grandT {
            width: 320px;
            margin-right: 20px;
            display: inline-block;
            position: fixed;
            left: 438px;
        }

        .grandT table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        .grandT tr,
        .grandT td {
            width: 80%;
        }

        .grandT1 {
            width: 10% !important;
            text-align: center;
        }

        .grandT2 {
            width: 12% !important;
            text-align: center;
        }

        .bM {
            width: 96.5%;
            overflow: hidden;
            display: block;
            height: 395px;
            margin-bottom: 1.5%;
            border: 1px solid #616160;
        }

        .note1 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            width: 388px;
            display: inline-block;
            margin-left: 2px;
            border: 1px solid balck;
        }

        .guardNote {
            padding-top: 0px;
            padding-left: 7px;
            margin-bottom: 0;
            margin-top: 20px;
        }

        .guardTable {
            width: 98% !important;
            margin-top: -5px !important;
            margin-left: 1% !important;
        }

        .guardTable>table {
            border: 1px solid black !important;
        }

        .guardTable>table>tr,
        td {
            border: 1px solid black !important;
        }

        .grandDate {
            display: flex !important;
        }

        .lastD {
            height: fit-content !important;
            width: 180px !important;
            font-size: 10px !important;
            padding-left: 5px !important;
            margin-top: 17px !important;
        }

        .bankV {
            width: 96.5% !important;
            overflow: hidden !important;
            display: block !important;
            height: 230px !important;
            margin-bottom: 1.5%;
            border: 1px solid #616160 !important;
        }

        .dashed {
            width: 98% !important;
            position: relative !important;
            top: -5px;
            height: 3px !important;
            display: inline-block;
        }

        .dashed1 {
            width: 95.9% !important;
            border: 1px dashed #616160 !important;
            height: 0 !important;
            display: inline-block;
            position: relative;
            top: -14px;
            left: -2px;
        }

        .sci {
            position: relative !important;
            top: -10px !important;
            color: #616160 !important;
        }

        .sci1 {
            position: relative !important;
            top: -9px !important;
            color: #616160 !important;
        }
    </style>
  </head>
  <body>
   ${users2
     .map(
       (a, i) =>
         `
        <div class="pBox" style="margin: 10px  0;page-break-after:${
          i === users2.length - 1 ? "avoid" : "always"
        };">
        <div class="bM secPage">
            <header>
                <img src="https://ghazalians.com/static/media/schLogo.e0838927f4a9728169f3.png" alt="" class="logo" />
                <div class="guardFooter">Parent's COPY</div>
                <div class="text1">
                    <h3 class="dark">Ghazali Educational Complex Gatti</h3>
                    <h6 class="up dark">Habbib Bank ltd. 202/RB Gatti (0008697900152403) Branch Code (0869) </h6>
                </div>
                <div class="text2">
                    <p class="fam">
                        Family#: <b>${a.familyNo} </b>
                    </p>
                    <span class="father">
                        <p class="father1">Father Name:</p> <b>${
                          a.student.parentsInfo.father.name
                        }</b>
                    </span>
                    <p class="fatherCnic">
                        Father CNIC: <b>${a.student.parentsInfo.father.cnic}</b>
                    </p>
                    <p class="up1">
                        Billing Month: <b>${a.chargedMonth.toUpperCase()}</b>
                    </p>
                </div>
            </header>
            <div class="guardTable">
                <table cellSpacing="0" cellPadding="2">
                    <thead>
                        <td class="srNo">S#</td>
                        <td class="scnd">Students Name</td>
                        <td class="scnd">${a.student.stdName}</td>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="srNo">${counter}</td>
                            <td class="scnd">Class</td>
                            <td class="scnd">${a.student.class.name}</td>
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Reg#</td>
                            <td class="scnd">${a.student.admissionNo}</td>
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Class Fee</td>
                            <td class="scnd">${a.basicFee}</td>
                        </tr>
                         ${
                           a.otherCharges
                             .map((c) => {
                               return Object.values(c.charges)
                                 .map((data) => {
                                   return `
                                <tr >
                                  <td class="srNo">${(counter = ++counter)}</td>
                                  <td class="scnd">${Object.keys(data)}</td>
                                  <td class="scnd">
                                    ${Object.values(data)}
                                  </td>
                                </tr>`;
                                 })
                                 .join("");
                             })
                             .join("") || null
                         }
                        ${
                          a.arrears
                            ? `<tr>
                              <td class="srNo">${(counter = ++counter)}</td>
                              <td class="scnd">Arrears</td>
                              <td class="scnd">${a.arrears}</td>
                            </tr>`
                            : `<tr style="display:none">
                            </tr>`
                        }

                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Payable</td>
                            <td class="scnd">${a.due}</td>
                        </tr>


                    </tbody>
                </table>
            </div>
            <div class="guardNote">
                <div class="note1">Note: ${a.note}</div>
                <div class="grandT">
                    <table>
                        <tr>
                            <td class="grandT1">Total</td>
                            <td class="grandT2">After due date</td>
                            <td class="grandT1">Due Date</td>
                        </tr>
                        <tr>
                            <td class="grandT1">${a.due}</td>
                            <td class="grandT2"> ${a.due + +a.afterDueDate}</td>
                            <td class="grandT1"> ${cdDate(
                              new Date(a.dueDate).toLocaleDateString()
                            )}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="dashed">
            <span class="sci">&#9986</span>
            <div class="dashed1"></div>
        </div>
        <div class="bM">
            <header>
                <img src="https://ghazalians.com/static/media/schLogo.e0838927f4a9728169f3.png" alt="" class="logo" />
                <div class="guardFooter">School COPY</div>
                <div class="text1">
                    <h3 class="dark">Ghazali Educational Complex Gatti</h3>
                    <h6 class="up dark">Habbib Bank ltd. 202/RB Gatti (0008697900152403) Branch Code (0869) </h6>
                </div>
                <div class="text2">
                    <p class="fam">Family#: <b>${a.familyNo} </b></p>
                    <span class="father">
                        <p class="father1">Father Name:</p> <b>${
                          a.student.parentsInfo.father.name
                        }</b>
                    </span>
                    <p class="fatherCnic">
                        Father CNIC: <b>${a.student.parentsInfo.father.cnic}</b>
                    </p>
                    <p class="up1">
                        Billing Month: <b>${a.chargedMonth.toUpperCase()}</b>
                    </p>
                </div>
            </header>
            <div class="guardTable">
                <table cellSpacing="0" cellPadding="2">
                    <thead>
                        <td class="srNo">S#</td>
                        <td class="scnd">Students Name</td>
                        <td class="scnd">${a.student.stdName}</td>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="srNo">${(counter = 1)}</td>
                            <td class="scnd">Class</td>
                            <td class="scnd">${a.student.class.name}</td>
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Reg#</td>
                            <td class="scnd">${a.student.admissionNo} </td>
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Class Fee</td>
                            <td class="scnd">${a.basicFee}</td>
                        </tr>
                         ${
                           a.otherCharges
                             .map((c) => {
                               return Object.values(c.charges)
                                 .map((data) => {
                                   return `
                                <tr >
                                  <td class="srNo">${(counter = ++counter)}</td>
                                  <td class="scnd">${Object.keys(data)}</td>
                                  <td class="scnd">
                                    ${Object.values(data)}
                                  </td>
                                </tr>`;
                                 })
                                 .join("");
                             })
                             .join("") || null
                         }
                        ${
                          a.arrears
                            ? `<tr>
                              <td class="srNo">${(counter = ++counter)}</td>
                              <td class="scnd">Arrears</td>
                              <td class="scnd">${a.arrears}</td>
                            </tr>`
                            : `<tr style="display:none">
                            </tr>`
                        }
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Payable</td>
                            <td class="scnd">${a.due}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="guardNote">
                <div class="note1">Note: ${a.note}</div>
                <div class="grandT">
                    <table>
                        <tr>
                            <td class="grandT1">Total</td>
                            <td class="grandT2">After due date</td>
                            <td class="grandT1">Due Date</td>
                        </tr>
                        <tr>
                            <td class="grandT1">${a.due}</td>
                            <td class="grandT2"> ${a.due + +a.afterDueDate}</td>
                            <td class="grandT1"> ${cdDate(
                              new Date(a.dueDate).toLocaleDateString()
                            )}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="dashed">
            <span class="sci1">&#9986</span>
            <div class="dashed1"></div>
        </div>
        <div class="bankV">
            <header>
                <img src="https://ghazalians.com/static/media/schLogo.e0838927f4a9728169f3.png" alt="" class="logo" />
                <div class="guardFooter">Bank COPY</div>
                <div class="text1">
                    <h3 class="dark">Ghazali Educational Complex Gatti</h3>
                    <h6 class="up dark">Habbib Bank ltd. 202/RB Gatti (0008697900152403) Branch Code (0869) </h6>
                </div>
                <div class="text2">
                    <p class="fam">Family#: <b>${a.familyNo} </b></p>
                    <span class="father">
                        <p class="father1">Father Name:</p> <b>${
                          a.student.parentsInfo.father.name
                        }</b>
                    </span>
                    <p class="fatherCnic">
                        Father CNIC: <b>${a.student.parentsInfo.father.cnic}</b>
                    </p>
                    <p class="up1">
                        Billing Month: <b>${a.chargedMonth.toUpperCase()}</b>
                        </p>
                </div>
            </header>
            <div class="guardTable">
                <table cellSpacing="0" cellPadding="2">
                    <thead>
                        <td class="srNo">S#</td>
                        <td class="scnd">Students Name</td>
                        <td class="scnd">${a.student.stdName}</td>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="srNo">${(counter = 1)}</td>
                            <td class="scnd">Class</td>
                            <td class="scnd">${a.student.class.name}</td>
                        </tr>
                        <td class="srNo">${(counter = ++counter)}</td>
                        <td class="scnd">Reg#</td>
                        <td class="scnd">${a.student.admissionNo}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="guardNote">
                <div class="note1">Note: ${a.note}</div>
                <div class="grandT">
                    <table>
                        <tr>
                            <td class="grandT1">Total</td>
                            <td class="grandT2">After due date</td>
                            <td class="grandT1">Last Date</td>
                        </tr>
                        <tr>
                            <td class="grandT1">${a.due}</td>
                            <td class="grandT2"> ${a.due + +a.afterDueDate}</td>
                            <td class="grandT1"> ${cdDate(
                              new Date(a.dueDate).toLocaleDateString()
                            )}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
     )
     .join("")}
</body>
</html>
`;
    var document = {
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
        const del = (fileName) => {
          setTimeout(() => {
            fs.unlink(fileName, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("deleted");
              }
            });
          }, 600000);
        };

        del(a);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(users);
  },
  create3: (req, res) => {
    let users = req.vouchers;
    console.log(users);

    let counter = 1;

    var options = {
      format: "Tabloid",
      orientation: "portrait",
      border: "0",
      timeout: 1800000,
    };
    console.log(users.length);
    // let ark = newArry(users);

    const html = `
  <html>
  <head>
    <style>
        .pBox {
            width: 100%;
            display: block;
            color: black;
            margin-left: 8px;
            padding-left: 10px;
            padding-top: 20px;

        }

        header {
            margin: 0%;
            padding: 0%;
        }

        .logo {
            width: 75px;
            float: left;
            margin-top: -2px;
            margin-left: 10px;
        }

        .guardFooter {
            float: right;
            padding: 2px;
            font-size: 10px;
            margin-right: 10px;
            margin-top: 10px;
            display: block;
            font-weight: bold;
        }

        .text1 {
            text-align: center;
            margin-top: 0px;
            width: 650px;
        }

        .up {
            margin-top: -11px;
            margin-bottom: -5px;
            margin-right: 0;
        }

        .up1 {
            font-size: 10px;
            text-align: left;
            width: 208px;
            margin-top: 0;
            position: relative;
            left: 45px;
            display: inline-block;
        }

        .lastD {
            display: inline-block;
            border: 1px solid white;
            font-weight: bold;
            font-size: 10px;
        }

        .fam {
            display: inline-block;
        }

        .father {
            position: relative;
            left: 21px;
            display: inline-block;
        }

        .fatherCnic {
            position: relative;
            left: 35px;
            display: inline-block;
        }

        .father1 {
            display: inline-block;
        }

        .text2 {
            font-size: 10px;
            margin-right: -10px;
            margin-top: 8px;
            width: 645px;
            margin-left: 80px;
            text-align: center;
        }

        .pBox table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid white;
            font-size: 10px;
        }

        .pBox tr,
        .pBox td {
            border: 1px solid white;
            width: 40%;
            padding-left: 5px;
        }

        .srNo {
            width: 2% !important;
            text-align: center;
        }

        .scnd {
            width: 10% !important;
        }

        .grandT {
            width: 320px;
            margin-right: 20px;
            display: inline-block;
            position: fixed;
            left: 438px;
        }

        .grandT table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }

        .grandT tr,
        .grandT td {
            width: 80%;
        }

        .grandT1 {
            width: 10% !important;
            text-align: center;
        }

        .grandT2 {
            width: 12% !important;
            text-align: center;
        }

        .bM {
            width: 96.5%;
            overflow: hidden;
            display: block;
            height: 395px;
            margin-bottom: 1.5%;
            border: 1px solid #616160;
        }

        .note1 {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            width: 388px;
            display: inline-block;
            margin-left: 2px;
            border: 1px solid balck;
        }

        .guardNote {
            padding-top: 0px;
            padding-left: 7px;
            margin-bottom: 0;
            margin-top: 20px;
        }

        .guardTable {
            width: 98% !important;
            margin-top: -5px !important;
            margin-left: 1% !important;
        }

        .guardTable>table {
            border: 1px solid black !important;
        }

        .guardTable>table>tr,
        td {
            border: 1px solid black !important;
        }

        .grandDate {
            display: flex !important;
        }

        .lastD {
            height: fit-content !important;
            width: 180px !important;
            font-size: 10px !important;
            padding-left: 5px !important;
            margin-top: 17px !important;
        }

        .bankV {
            width: 96.5% !important;
            overflow: hidden !important;
            display: block !important;
            height: 230px !important;
            margin-bottom: 1.5%;
            border: 1px solid #616160 !important;
        }

        .dashed {
            width: 98% !important;
            position: relative !important;
            top: -5px;
            height: 3px !important;
            display: inline-block;
        }

        .dashed1 {
            width: 95.9% !important;
            border: 1px dashed #616160 !important;
            height: 0 !important;
            display: inline-block;
            position: relative;
            top: -14px;
            left: -2px;
        }

        .sci {
            position: relative !important;
            top: -10px !important;
            color: #616160 !important;
        }

        .sci1 {
            position: relative !important;
            top: -9px !important;
            color: #616160 !important;
        }
    </style>
  </head>
  <body>
  ${users
    .map(
      (val, i) => {
        if (val.value.map((itm) => itm.value !== [])) {
          const newdata = [];
          console.log(i);
          let grandTotal = 0;
          let afterDue = 0;
          val.value &&
            val.value.length &&
            val.value.map(
              (item) =>
                item &&
                item.value &&
                item.value.length &&
                item.value[0] &&
                item.value[0].otherCharges.length &&
                item.value[0].otherCharges.map((item) => {
                  item.charges &&
                    item.charges.length &&
                    item.charges.map((item) =>
                      Object.keys(item).length
                        ? Object.keys(item) &&
                          Object.keys(item).length &&
                          Object.keys(item).map((item) =>
                            newdata.includes(item)
                              ? console.log(false)
                              : newdata.push(item)
                          )
                        : console.log(false)
                    );
                })
            );
          {
            val.value.map((val1) =>
              val1.value.map((val2) => (grandTotal = grandTotal + +val2.due))
            );
          }
          {
            val.value.map((val1) =>
              val1.value.map(
                (val2) => (afterDue = afterDue + +val2.afterDueDate)
              )
            );
          }

          return `
        <div class="pBox" style="margin: 10px  0;page-break-after:${
          i === users.length - 1 ? "avoid" : "always"
        };">
        <div class="bM secPage">
            <header>
                <img src="https://ghazalians.com/static/media/schLogo.e0838927f4a9728169f3.png" alt="" class="logo" />
                <div class="guardFooter">Parent's COPY</div>
                <div class="text1">
                    <h3 class="dark">Ghazali Educational Complex Gatti</h3>
                    <h6 class="up dark">Habbib Bank ltd. 202/RB Gatti (0008697900152403) Branch Code (0869) </h6>
                </div>
                <div class="text2">
                    <p class="fam">
                        Family#: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].familyNo
                        } </b>
                    </p>
                    
                    <span class="father">
                        <p class="father1">Father Name:</p> <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].student &&
                          val.value[0].value[0].student.parentsInfo &&
                          val.value[0].value[0].student.parentsInfo.father &&
                          val.value[0].value[0].student.parentsInfo.father.name
                        }</b>
                    </span>
                    <p class="fatherCnic">
                        Father CNIC: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].student &&
                          val.value[0].value[0].student.parentsInfo &&
                          val.value[0].value[0].student.parentsInfo.father &&
                          val.value[0].value[0].student.parentsInfo.father.cnic
                        }</b>
                    </p>
                    <p class="up1">
                        Billing Month: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].chargedMonth &&
                          val.value[0].value[0].chargedMonth.toUpperCase()
                        }</b>
                    </p>
                </div>
            </header>
            <div class="guardTable">
                <table cellSpacing="0" cellPadding="2">
                    <thead>
                        <td class="srNo">S#</td>
                        <td class="scnd">Students Name</td>

                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.stdName}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                    </thead>
                    <tbody>
                        <tr>
                            <td class="srNo">${counter}</td>
                            <td class="scnd">Class</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.class.name}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Reg#</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.admissionNo}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Class Fee</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.basicFee}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                          ${
                            newdata.length !== 0
                              ? newdata &&
                                newdata.length &&
                                newdata
                                  .map(
                                    (key) =>
                                      `<tr>
                          <td class="srNo">${(counter = ++counter)}</td>
                          <td class="scnd">${key}</td>
                          ${val.value
                            .map((val1) =>
                              val1.value.map(
                                (val2) =>
                                  `<td class="scnd">${val2.otherCharges
                                    .map((val3) =>
                                      val3.charges
                                        .map((val4) =>
                                          typeof val4[key] !== "undefined"
                                            ? val4[key]
                                            : 0
                                        )
                                        .toString()
                                        .replace(/\,0|0,+/g, "")
                                    )
                                    .toString()
                                    .replace(/\,0|0,+/g, "")}</td>`
                              )
                            )
                            .join("")}
                          </tr>`
                                  )
                                  .join("")
                              : `<tr style="display:none"></tr>`
                          }

                        ${val.value
                          .map((val1) =>
                            val1.value.map((val2) =>
                              val2.arrears !== 0
                                ? `<tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Arrears</td>
                            ${val.value
                              .map((val3) =>
                                val3.value.map(
                                  (val4) =>
                                    `  <td class="scnd">${val4.arrears}</td>`
                                )
                              )
                              .join("")}
                        </tr>`
                                : null
                            )
                          )
                          .join("")}

                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Payable</td>
                            ${val.value
                              .map((val1) => {
                                return val1.value
                                  .map((val2) => {
                                    return `<td class="scnd">${val2.due}</td>`;
                                  })
                                  .join("");
                              })
                              .join("")}
                        </tr>


                    </tbody>
                </table>
            </div>
            <div class="guardNote">
                <div class="note1">Note: ${
                  val &&
                  val.value &&
                  val.value.length &&
                  val.value[0] &&
                  val.value[0].value[0] &&
                  val.value[0].value[0].note
                }</div>
                <div class="grandT">
                    <table>
                        <tr>
                            <td class="grandT1">Total</td>
                            <td class="grandT2">After due date</td>
                            <td class="grandT1">Due Date</td>
                        </tr>
                        <tr>
                            <td class="grandT1">${grandTotal}</td>
                            <td class="grandT2"> ${grandTotal + afterDue}</td>
                            <td class="grandT1"> ${cdDate(
                              val &&
                                val.value &&
                                val.value.length &&
                                val.value[0] &&
                                val.value[0].value[0] &&
                                val.value[0].value[0].dueDate &&
                                new Date(
                                  val.value[0].value[0].dueDate
                                ).toLocaleDateString()
                            )}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="dashed">
            <span class="sci">&#9986</span>
            <div class="dashed1"></div>
        </div>
        <div class="bM">
            <header>
                <img src="https://ghazalians.com/static/media/schLogo.e0838927f4a9728169f3.png" alt="" class="logo" />
                <div class="guardFooter">School COPY</div>
                <div class="text1">
                    <h3 class="dark">Ghazali Educational Complex Gatti</h3>
                    <h6 class="up dark">Habbib Bank ltd. 202/RB Gatti (0008697900152403) Branch Code (0869) </h6>
                </div>
                <div class="text2">
                    <p class="fam">Family#: <b>${
                      val &&
                      val.value &&
                      val.value.length &&
                      val.value[0] &&
                      val.value[0].value[0] &&
                      val.value[0].value[0].familyNo
                    } </b></p>
                    <span class="father">
                        <p class="father1">Father Name:</p> <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].student &&
                          val.value[0].value[0].student.parentsInfo &&
                          val.value[0].value[0].student.parentsInfo.father &&
                          val.value[0].value[0].student.parentsInfo.father.name
                        }</b>
                    </span>
                    <p class="fatherCnic">
                        Father CNIC: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].student &&
                          val.value[0].value[0].student.parentsInfo &&
                          val.value[0].value[0].student.parentsInfo.father &&
                          val.value[0].value[0].student.parentsInfo.father.cnic
                        }</b>
                    </p>
                    <p class="up1">
                        Billing Month: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].chargedMonth &&
                          val.value[0].value[0].chargedMonth.toUpperCase()
                        }</b>
                    </p>
                </div>
            </header>
            <div class="guardTable">
                <table cellSpacing="0" cellPadding="2">
                    <thead>
                        <td class="srNo">S#</td>
                        <td class="scnd">Students Name</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.stdName}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                    </thead>
                    <tbody>
                        <tr>
                            <td class="srNo">${(counter = 1)}</td>
                            <td class="scnd">Class</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.class.name}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Reg#</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.admissionNo}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Class Fee</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.basicFee}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                        ${
                          newdata.length !== 0
                            ? newdata &&
                              newdata.length &&
                              newdata
                                .map(
                                  (key) =>
                                    `<tr>
                          <td class="srNo">${(counter = ++counter)}</td>
                          <td class="scnd">${key}</td>
                          ${val.value
                            .map((val1) =>
                              val1.value.map(
                                (val2) =>
                                  `<td class="scnd">${val2.otherCharges
                                    .map((val3) =>
                                      val3.charges
                                        .map((val4) =>
                                          typeof val4[key] !== "undefined"
                                            ? val4[key]
                                            : 0
                                        )
                                        .toString()
                                        .replace(/\,0|0,+/g, "")
                                    )
                                    .toString()
                                    .replace(/\,0|0,+/g, "")}</td>`
                              )
                            )
                            .join("")}
                          </tr>`
                                )
                                .join("")
                            : `<tr style="display:none"></tr>`
                        }



                        ${val.value
                          .map((val1) =>
                            val1.value.map((val2) =>
                              val2.arrears !== 0
                                ? `<tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Arrears</td>
                            ${val.value
                              .map((val3) =>
                                val3.value.map(
                                  (val4) =>
                                    `  <td class="scnd">${val4.arrears}</td>`
                                )
                              )
                              .join("")}
                        </tr>`
                                : null
                            )
                          )
                          .join("")}

                        <tr>
                            <td class="srNo">${(counter = ++counter)}</td>
                            <td class="scnd">Payable</td>
                            ${val.value
                              .map((val1) => {
                                return val1.value
                                  .map((val2) => {
                                    return `<td class="scnd">${val2.due}</td>`;
                                  })
                                  .join("");
                              })
                              .join("")}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="guardNote">
                <div class="note1">Note: ${
                  val &&
                  val.value &&
                  val.value.length &&
                  val.value[0] &&
                  val.value[0].value[0] &&
                  val.value[0].value[0].note
                }</div>
                <div class="grandT">
                    <table>
                        <tr>
                            <td class="grandT1">Total</td>
                            <td class="grandT2">After due date</td>
                            <td class="grandT1">Due Date</td>
                        </tr>
                        <tr>
                            <td class="grandT1">${grandTotal}</td>
                            <td class="grandT2"> ${grandTotal + afterDue}</td>
                            <td class="grandT1"> ${cdDate(
                              val &&
                                val.value &&
                                val.value.length &&
                                val.value[0] &&
                                val.value[0].value[0] &&
                                val.value[0].value[0].dueDate &&
                                new Date(
                                  val.value[0].value[0].dueDate
                                ).toLocaleDateString()
                            )}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="dashed">
            <span class="sci1">&#9986</span>
            <div class="dashed1"></div>
        </div>
        <div class="bankV">
            <header>
                <img src="https://ghazalians.com/static/media/schLogo.e0838927f4a9728169f3.png" alt="" class="logo" />
                <div class="guardFooter">Bank COPY</div>
                <div class="text1">
                    <h3 class="dark">Ghazali Educational Complex Gatti</h3>
                    <h6 class="up dark">Habbib Bank ltd. 202/RB Gatti (0008697900152403) Branch Code (0869) </h6>
                </div>
                <div class="text2">
                    <p class="fam">Family#: <b>${
                      val &&
                      val.value &&
                      val.value.length &&
                      val.value[0] &&
                      val.value[0].value[0] &&
                      val.value[0].value[0].familyNo
                    }  </b></p>
                    <span class="father">
                        <p class="father1">Father Name:</p> <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].student &&
                          val.value[0].value[0].student.parentsInfo &&
                          val.value[0].value[0].student.parentsInfo.father &&
                          val.value[0].value[0].student.parentsInfo.father.name
                        }</b>
                    </span>
                    <p class="fatherCnic">
                        Father CNIC: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].student &&
                          val.value[0].value[0].student.parentsInfo &&
                          val.value[0].value[0].student.parentsInfo.father &&
                          val.value[0].value[0].student.parentsInfo.father.cnic
                        }</b>
                    </p>
                    <p class="up1">
                        Billing Month: <b>${
                          val &&
                          val.value &&
                          val.value.length &&
                          val.value[0] &&
                          val.value[0].value[0] &&
                          val.value[0].value[0].chargedMonth &&
                          val.value[0].value[0].chargedMonth.toUpperCase()
                        }</b>
                        </p>
                </div>
            </header>
            <div class="guardTable">
                <table cellSpacing="0" cellPadding="2">
                    <thead>
                        <td class="srNo">S#</td>
                        <td class="scnd">Students Name</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.stdName}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                    </thead>
                    <tbody>
                        <tr>
                            <td class="srNo">${(counter = 1)}</td>
                            <td class="scnd">Class</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.class.name}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                        <td class="srNo">${(counter = ++counter)}</td>
                        <td class="scnd">Reg#</td>
                        ${val.value
                          .map((val1) => {
                            return val1.value
                              .map((val2) => {
                                return `<td class="scnd">${val2.student.admissionNo}</td>`;
                              })
                              .join("");
                          })
                          .join("")}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="guardNote">
                <div class="note1">Note: ${
                  val &&
                  val.value &&
                  val.value.length &&
                  val.value[0] &&
                  val.value[0].value[0] &&
                  val.value[0].value[0].note
                }</div>
                <div class="grandT">
                    <table>
                        <tr>
                            <td class="grandT1">Total</td>
                            <td class="grandT2">After due date</td>
                            <td class="grandT1">Last Date</td>
                        </tr>
                        <tr>
                            <td class="grandT1">${grandTotal}</td>
                            <td class="grandT2"> ${grandTotal + afterDue}</td>
                            <td class="grandT1"> ${cdDate(
                              val &&
                                val.value &&
                                val.value.length &&
                                val.value[0] &&
                                val.value[0].value[0] &&
                                val.value[0].value[0].dueDate &&
                                new Date(
                                  val.value[0].value[0].dueDate
                                ).toLocaleDateString()
                            )}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;
        }
      }

      // )
    )
    .join("")}
</body>
</html>
`;

    var document = {
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
        const del = (fileName) => {
          setTimeout(() => {
            fs.unlink(fileName, (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log("deleted");
              }
            });
          }, 600000);
        };

        del(a);
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
