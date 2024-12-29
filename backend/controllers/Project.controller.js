import mongoose from "mongoose";
import { ProjectModel } from "../models/Project.model.js";
import { UserModel } from "../models/User.model.js";

export const CreateProjectController = async (req, res) => {
  try {
    const { name } = req.body;
    const User = req.User;

    if (!name) {
      res.status(400).json({
        message: "Project name must be provided",
        success: false,
      });
    }

    const Project = await ProjectModel.create({
      name,
      author: User._id,
      users: [User._id],
    });

    const newUser = await UserModel.findOne({ _id: User._id });
    newUser.projects.push(Project._id);
    await newUser.save();

    return res.status(201).json({
      message: "Project Created",
      Project,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error While Creating Project",
      error: error.message,
      success: false,
    });
    return;
  }
};

export const GetAllProjectsController = async (req, res) => {
  try {
    const User = req.User;

    const Projects = await ProjectModel.find({ users: { $in: [User._id] } })
      .populate("users")
      .populate("author");
    return res.status(200).json({
      success: true,
      Projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong",
      success: false,
    });
  }
};

export const NomalizeProjectIDS = (ProjectUsers, Users, authorID) => {
  // Initialize arrays to hold present and not present users
  const presentUsers = [];
  const notPresentUsers = [];
  const final = [authorID];
  // Iterate through each user in ProjectUsers
  ProjectUsers.forEach((user) => {
    // Skip the author of the project
    if (user.toString() !== authorID) {
      // Check if the user is present in the Users array
      if (Users.find((u) => u.toString() === user.toString())) {
        // If present, add to presentUsers array
        presentUsers.push(user);
      } else {
        // If not present, add to notPresentUsers array
        notPresentUsers.push(user);
      }
    }
  });
  ProjectUsers.forEach((user) => {
    if (presentUsers.indexOf(user) > -1) {
      final.push(user);
    }
    if (!(Users.find((e) => e == user) && user == authorID.toString())) {
      console.log(user);
      final.push(user);
    }
  });
  // Return an object containing present and not present users
  return { presentUsers, notPresentUsers, final };
};

export const AddUserToProjectController = async (req, res) => {
  try {
    const { ProjectID, UsersID } = req.body;

    if (
      !Array.isArray(UsersID) ||
      UsersID.some(
        (id) => typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)
      )
    ) {
      return res.status(400).json({
        message: "Invalid UsersID format. Expected an array of mongoose IDs.",
        success: false,
      });
    }
    const Project = await ProjectModel.findById(ProjectID);
    if (!Project) {
      return res.status(404).json({
        message: "Project not found",
        success: false,
      });
    }
    const authorID = Project.author;

    const NotPresentInUsersID = Project.users.filter((e, i, a) => {
      const ID = e.toString();
      return ID !== authorID.toString() && UsersID.indexOf(e) < 0;
    });

    for (const e of NotPresentInUsersID) {
      const User = await UserModel.findById(e);
      if (User.projects.includes(ProjectID)) {
        User.projects = User.projects.filter(project => project.toString() !== ProjectID);
        Project.users = Project.users.filter(user => user.toString() !== e);
        await User.save();
        await Project.save();
      }
    }

    const NewUsers = [...UsersID];

    await Promise.all(
      NewUsers.map(async (e) => {
        const User = await UserModel.findById(e);
        User.projects.push(ProjectID)
        return User.save();
      })
    )
    Project.users = [...new Set(NewUsers.concat(authorID))];

    await Project.save();

    return res.status(200).json({
      message: "Users updated in project",
      success: true,
      Project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const GetProjectController = async (req, res) => {
  try {
    const { projectID } = req.params;
    const Project = await ProjectModel.findOne({ _id: projectID })
      .populate("users")
      .populate("author");

    if (!Project) {
      return res.status(400).json({
        message: "Invalid Project",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Project Found",
      success: true,
      Project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong",
      success: false,
    });
  }
};
