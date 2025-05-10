const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;
const uuidv1 = require("uuid");
const crypto = require("crypto");

const staffScehma = new Schema({
  title: {
    type: String,
    required: true,
    enum: ["Mr.", "Ms.", "Mrs."],
  },
  school: {
    type: ObjectId,
    ref: "School",
    // required: true,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
  },
  machine_id: {
    type: Number,
  },
  pic: {
    type: String,
  },
  cardNo: {
    type: Number,
    required: true,
    unique: true,
  },
  schoolCardType: {
    type: String,
    default: "Staff",
  },
  email: {
    type: String,
    required: true,
    trim: true,
    tolowercase: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
    enum: [
      "teacher",
      "clerk",
      "maid",
      "watchman",
      "canteenManager",
      "sweeper",
      "principal",
      "computerOperator",
    ],
  },
  inchargeOf: {
    type: ObjectId,
    ref: "Section",
  },
  regNum: {
    type: String,
    required: true,
    unique: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  resigningDate: {
    type: Date,
  },
  reJoin: {
    type: Boolean,
    default: false,
  },
  salary: {
    type: Number,
    required: true,
  },
  salaryHistory: {
    jan: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    feb: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    mar: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    apr: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    may: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    jun: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    jul: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    aug: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    sep: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    oct: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
    nov: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },

    dec: {
      paid: {
        type: Boolean,
        default: false,
      },
      paidDate: {
        type: Date,
      },
      voucherNo: {
        type: String,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      fineAmount: {
        type: Number,
        default: 0,
      },
    },
  },
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
    unique: true,
  },
  password: {
    type: String,
  },
  setting: {
    status: {
      type: String,
      defualt: "inActive",
      enum: ["active", "inActive"],
    },
    canSMS: {
      type: Boolean,
      default: false,
    },
    allowInBefore: {
      type: String,
      required: true,
    },
    allowOutAfter: {
      type: String,
      required: true,
    },
  },
  education: {
    type: Array,
    required: true,
  },
  family: {
    pic: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      enum: ["father", "husband", "brother"],
      required: true,
      tolowercase: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
  },
  inActive: {
    type: Boolean,
    default: false,
  },
  cnic: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    maxlength: 200,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  contactInfo2: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 4,
  },
  createdByRole: {
    type: String,
    enum: ["Admin", "Staff"],
  },
  createdBy: {
    type: ObjectId,
    refPath: "createdByRole",
  },
  permissions: {
    type: ObjectId,
    ref: "Permissions",
  },
});
module.exports = mongoose.model("Staff", staffScehma);
