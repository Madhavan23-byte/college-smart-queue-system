const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const dns = require("dns");

const User = require("./models/User");
const Request = require("./models/Request");

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await User.deleteMany();
    await Request.deleteMany();

    console.log("Old users and requests deleted");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [
      {
        name: "Madhavan Nagarajan",
        email: "student@college.com",
        password: hashedPassword,
        role: "student",
        department: "B.Tech. Information Technology",
        assignedService: "None"
      },
      {
        name: "Arun Kumar",
        email: "student2@college.com",
        password: hashedPassword,
        role: "student",
        department: "B.E. Computer Science & Engineering",
        assignedService: "None"
      },
      {
        name: "Dr. Priya Raman",
        email: "professor@college.com",
        password: hashedPassword,
        role: "professor",
        department: "B.Tech. Information Technology",
        assignedService: "None"
      },
      {
        name: "Overall Admin",
        email: "admin@college.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin Office",
        assignedService: "Overall Admin"
      },
      {
        name: "Xerox Shop Admin",
        email: "xeroxadmin@college.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin Office",
        assignedService: "Xerox Shop"
      },
      {
        name: "Accounts No-Due Admin",
        email: "accountsadmin@college.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin Office",
        assignedService: "No-Due Form - Accounts Section"
      },
      {
        name: "Library No-Due Admin",
        email: "libraryadmin@college.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin Office",
        assignedService: "No-Due Form - Library Section"
      },
      {
        name: "Permission Letter Admin",
        email: "permissionadmin@college.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin Office",
        assignedService: "Permission Letter Signing"
      },
      {
        name: "Principal Office Admin",
        email: "principaladmin@college.com",
        password: hashedPassword,
        role: "admin",
        department: "Admin Office",
        assignedService: "Principal Meeting"
      }
    ];

    await User.insertMany(users);

    const requests = [
      {
        userName: "Madhavan Nagarajan",
        role: "student",
        service: "Xerox Shop",
        purpose: "Print assignment document",
        tokenNumber: 101,
        timeSlot: "8:30 AM - 9:30 AM",
        status: "Waiting"
      },
      {
        userName: "Arun Kumar",
        role: "student",
        service: "Xerox Shop",
        purpose: "Take xerox copy of lab manual",
        tokenNumber: 102,
        timeSlot: "9:30 AM - 10:30 AM",
        status: "Processing"
      },
      {
        userName: "Madhavan Nagarajan",
        role: "student",
        service: "No-Due Form - Accounts Section",
        purpose: "Accounts no-due verification",
        tokenNumber: 103,
        timeSlot: "10:30 AM - 11:30 AM",
        status: "Called"
      },
      {
        userName: "Arun Kumar",
        role: "student",
        service: "No-Due Form - Library Section",
        purpose: "Library no-due form signing",
        tokenNumber: 104,
        timeSlot: "11:30 AM - 12:30 PM",
        status: "Waiting"
      },
      {
        userName: "Madhavan Nagarajan",
        role: "student",
        service: "Permission Letter Signing",
        purpose: "Permission letter for industrial visit",
        tokenNumber: 105,
        timeSlot:
          "Tutor: 8:30 AM - 9:30 AM, Senior Tutor: 9:30 AM - 10:30 AM, HOD: 10:30 AM - 11:30 AM",
        status: "Approved"
      },
      {
        userName: "Dr. Priya Raman",
        role: "professor",
        service: "Principal Meeting",
        purpose: "Discussion about department academic event",
        tokenNumber: 106,
        timeSlot: "9:00 AM - 10:00 AM",
        status: "Waiting"
      },
      {
        userName: "Dr. Priya Raman",
        role: "professor",
        service: "Xerox Shop",
        purpose: "Print question paper reference copies",
        tokenNumber: 107,
        timeSlot: "1:30 PM - 2:30 PM",
        status: "Processing"
      },

      {
        userName: "Madhavan Nagarajan",
        role: "student",
        service: "Xerox Shop",
        purpose: "Old completed xerox request",
        tokenNumber: 108,
        timeSlot: "2:30 PM - 3:30 PM",
        status: "Completed"
      },
      {
        userName: "Arun Kumar",
        role: "student",
        service: "No-Due Form - Library Section",
        purpose: "Incomplete library record",
        tokenNumber: 109,
        timeSlot: "3:30 PM - 4:30 PM",
        status: "Rejected"
      },
      {
        userName: "Dr. Priya Raman",
        role: "professor",
        service: "Principal Meeting",
        purpose: "Cancelled meeting request",
        tokenNumber: 110,
        timeSlot: "3:00 PM - 4:00 PM",
        status: "Cancelled"
      },
      {
        userName: "Madhavan Nagarajan",
        role: "student",
        service: "Permission Letter Signing",
        purpose: "Completed permission letter request",
        tokenNumber: 111,
        timeSlot:
          "Tutor: 1:30 PM - 2:30 PM, Senior Tutor: 2:30 PM - 3:30 PM, HOD: 3:30 PM - 4:30 PM",
        status: "Completed"
      }
    ];

    await Request.insertMany(requests);

    console.log("Clean demo users inserted");
    console.log("Clean demo requests inserted");
    console.log("Seeding completed successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();