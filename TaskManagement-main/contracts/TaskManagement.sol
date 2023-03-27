// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "hardhat/console.sol"; 
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TaskManagement is AccessControl {
    bytes32 public constant TEAM_LEADER_ROLE = keccak256("TEAM_LEADER_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");

    struct Task {
        string title;
        uint256 createdDate;
        uint256 dueDate;
        bytes32 descriptionHash;
        bool important;
        bool completed;
    }

    mapping(address => Task[]) private tasks;
    mapping(address => uint256) private assignedTaskCount;
    mapping(address => uint256) private completedTaskCount;

    event TaskAdded(address indexed taskOwner, string title);
    event TaskUpdated(address indexed taskOwner, uint256 taskIndex);
    event TaskCompleted(address indexed taskOwner, uint256 taskIndex);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(TEAM_LEADER_ROLE, msg.sender);
    }

    function addMember(address member) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MEMBER_ROLE, member);
    }

    function removeMember(address member) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MEMBER_ROLE, member);
    }

    function addTask(string memory title, uint256 dueDate, bytes32 descriptionHash, bool important) public {
        Task memory task = Task(title, block.timestamp, dueDate, descriptionHash, important, false);
        tasks[msg.sender].push(task);
        assignedTaskCount[msg.sender]++;
        emit TaskAdded(msg.sender, title);
    }

    function getTaskCount() public view returns (uint256 assignedTasks, uint256 completedTasks) {
        return (assignedTaskCount[msg.sender], completedTaskCount[msg.sender]);
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }

    function getImportantTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = tasks[msg.sender];
        uint256 count;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].important) {
                count++;
            }
        }
        Task[] memory importantTasks = new Task[](count);
        count = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].important) {
                importantTasks[count] = allTasks[i];
                count++;
            }
        }
        return importantTasks;
    }

    function getCompletedTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = tasks[msg.sender];
        uint256 count;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].completed) {
                count++;
            }
        }
        Task[] memory completedTasks = new Task[](count);
        count = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].completed) {
                completedTasks[count] = allTasks[i];
                count++;
            }
        }
        return completedTasks;
    }

    function getUncompletedTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = tasks[msg.sender];
        uint256 count;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (!allTasks[i].completed) {
                count++;
            }
        }
        Task[] memory uncompletedTasks = new Task[](count);
        count = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (!allTasks[i].completed) {
                uncompletedTasks[count] = allTasks[i];
                count++;
            }
        }
        return uncompletedTasks;
    }

    function getTodayTasks() public view returns (Task[] memory) {
        Task[] memory allTasks = tasks[msg.sender];
        uint256 count;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].dueDate >= block.timestamp && allTasks[i].dueDate <= block.timestamp + 1 days) {
                count++;
            }
        }
        Task[] memory todayTasks = new Task[](count);
        count = 0;
        for (uint256 i = 0; i < allTasks.length; i++) {
            if (allTasks[i].dueDate >= block.timestamp && allTasks[i].dueDate <= block.timestamp + 1 days) {
                todayTasks[count] = allTasks[i];
                count++;
            }
        }
        return todayTasks;
    }

    function updateTask(uint256 taskIndex, string memory title, uint256 dueDate, bytes32 descriptionHash, bool important) public {
        require(taskIndex < tasks[msg.sender].length, "Task does not exist");
        if (hasRole(TEAM_LEADER_ROLE, msg.sender)) {
            require(taskIndex < assignedTaskCount[msg.sender], "Can only update assigned tasks");
        }
        Task storage task = tasks[msg.sender][taskIndex];
        task.title = title;
        task.dueDate = dueDate;
        task.descriptionHash = descriptionHash;
        task.important = important;
        emit TaskUpdated(msg.sender, taskIndex);
    }

    function toggleImportant(uint256 taskIndex) public {
        require(taskIndex < tasks[msg.sender].length, "Task does not exist");
        Task storage task = tasks[msg.sender][taskIndex];
        bool val = task.important;
        task.important = !val;
        emit TaskUpdated(msg.sender, taskIndex);
    }

    function completeTask(uint256 taskIndex) public {
        require(taskIndex < tasks[msg.sender].length, "Task does not exist");
        if (hasRole(TEAM_LEADER_ROLE, msg.sender)) {
            require(taskIndex < assignedTaskCount[msg.sender], "Can only complete assigned tasks");
        }
        Task storage task = tasks[msg.sender][taskIndex];
        task.completed = true;
        completedTaskCount[msg.sender]++;
        emit TaskCompleted(msg.sender, taskIndex);
    }

    function deleteTask(uint256 taskIndex) public {
        require(taskIndex < tasks[msg.sender].length, "Task does not exist");
        if (hasRole(TEAM_LEADER_ROLE, msg.sender)) {
            require(taskIndex < assignedTaskCount[msg.sender], "Can only delete assigned tasks");
        }
        assignedTaskCount[msg.sender]--;
        if (tasks[msg.sender][taskIndex].completed) {
            completedTaskCount[msg.sender]--;
        }
        tasks[msg.sender][taskIndex] = tasks[msg.sender][tasks[msg.sender].length - 1];
        tasks[msg.sender].pop();
    }
}
