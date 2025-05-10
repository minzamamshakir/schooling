const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema;
const uuid = require("uuid");
const crypto = require("crypto");
const studentSchema = new Schema(
  {
    school: {
      type: ObjectId,
      ref: "School",
      required: true,
    },
    session: {
      type: ObjectId,
      ref: "Session",
      required: true,
    },
    pic: {
      type: String,
    },
    level: {
      type: ObjectId,
      ref: "Level",
      required: true,
    },
    gender: {
      type: ObjectId,
      ref: "Gender",
      required: true,
    },
    class: {
      type: ObjectId,
      ref: "Class",
      required: true,
    },
    section: {
      type: ObjectId,
      ref: "Section",
      required: true,
    },
    smsNo: {
      type: String,
      required: true,
    },
    whatsappNo: {
      type: String,
      required: true,
    },
    stdName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    religion: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    username: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    preSchoolName: {
      type: String,

      maxlength: 32,
    },
    homeAddress: {
      type: String,
      required: true,
      maxlength: 100,
    },
    admissionNo: {
      type: String,
      required: true,
      unique: true,
      background: false,
    },
    mobileNo: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 200,
      required: true,
    },
    stdGender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    dob: {
      type: Date,
      required: true,
    },
    leavingDate: {
      type: Date,
    },
    reJoiningDate: {
      type: Date,
    },
    reJoin: {
      type: Boolean,
      default: false,
    },
    classAdmit: {
      type: String,
      default: "Please Enter Admitted Class",
    },
    cardNo: {
      type: Number,
      required: true,
      unique: true,
    },
    schoolCardType: {
      type: String,
      default: "Student",
    },
    certNo: {
      type: Number,
      required: true,
      default: 0,
    },
    addmissionDate: {
      type: Date,
      required: true,
    },
    allowLogin: {
      type: Boolean,
      default: false,
    },
    guardian: {
      type: ObjectId,
      ref: "Guardian",
      required: true,
    },
    rollNo: {
      type: Number,
      required: true,
    },
    machine_id: {
      type: Number,
    },
    feeData: {
      fee: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
      },
      regFee: {
        type: Number,
        // required: true,
      },
      otherChar: {
        type: Array,
      },
      totalFee: {
        type: Number,
      },
      remaining: {
        type: Number,
      },
      lastVoucher: {
        type: ObjectId,
        ref: "StudentsFee",
      },
      history: {
        jan: {
          paid: {
            type: Boolean,
            default: false,
          },
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
          other: [],
          partiallyPaid: {
            type: Boolean,
            default: false,
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
    },
    attendence: {
      type: [ObjectId],
      ref: "Attendance",
    },
    role: {
      type: String,
      required: true,
    },
    createdByRole: {
      type: String,
      enum: ["Admin", "Staff"],
    },
    createdBy: {
      type: ObjectId,
      refPath: "createdByRole",
    },
    parentsInfo: {
      father: {
        name: {
          type: String,
          required: true,
        },
        job: {
          type: String,
          required: true,
        },
        education: {
          type: String,
          required: true,
        },
        cnic: {
          type: String,
          required: true,
        },
        contactNo: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
      mother: {
        name: {
          type: String,
          required: true,
        },
        job: {
          type: String,
          required: true,
        },
        education: {
          type: String,
          required: true,
        },
        cnic: {
          type: String,
          required: true,
        },
        contactNo: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
    },
    inActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
