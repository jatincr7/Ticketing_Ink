const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TaskManagement', function () {
  let taskManagement;
  let teamLeader;
  let member;

  beforeEach(async function () {
    [teamLeader, member] = await ethers.getSigners();

    const TaskManagement = await ethers.getContractFactory('TaskManagement');
    taskManagement = await TaskManagement.deploy();
    await taskManagement.deployed();
  });

  describe('addMember', function () {
    it('should add a member with the MEMBER_ROLE', async function () {
      await taskManagement.addMember(member.address);
      expect(await taskManagement.hasRole(await taskManagement.MEMBER_ROLE(), member.address)).to.equal(true);
    });

    // it('should revert if called by a non-admin', async function () {
    //   await expect(taskManagement.connect(member).addMember(member.address)).to.be.revertedWith('AccessControl: sender must be an admin to grant');
    // });
  });

  describe('removeMember', function () {
    it('should remove a member with the MEMBER_ROLE', async function () {
      await taskManagement.addMember(member.address);
      await taskManagement.removeMember(member.address);
      expect(await taskManagement.hasRole(await taskManagement.MEMBER_ROLE(), member.address)).to.equal(false);
    });

    // it('should revert if called by a non-admin', async function () {
    //   await expect(taskManagement.connect(member).removeMember(member.address)).to.be.revertedWith('AccessControl: sender must be an admin to revoke');
    // });
  });

  describe('addTask', function () {
    it('should add a task', async function () {
      await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
      const tasks = await taskManagement.getTasks();
      expect(tasks.length).to.equal(1);
      expect(tasks[0].title).to.equal('Test task');
      expect(tasks[0].dueDate).to.equal(Math.floor(Date.now() / 1000) + 3600);
      expect(tasks[0].descriptionHash).to.equal('0x75a7a8b95dd77df9e5cfad0e2eaae1111b75d5e3bd9f658eafa2e5477453f695');
      expect(tasks[0].important).to.equal(true);
      expect(tasks[0].completed).to.equal(false);
    });
  });

  describe('getTaskCount', function () {
    it('should return the task counts', async function () {
      await taskManagement.addTask('Test task 1', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task 1 description'), true);
      await taskManagement.addTask('Test task 2', Math.floor(Date.now() / 1000) + 7200, ethers.utils.id('Test task 2 description'), true);
      await taskManagement.addTask('Test task 3', Math.floor(Date.now() / 1000) + 10800, ethers.utils.id('Test task 3 description'), true);

      const [assignedTasks, completedTasks] = await taskManagement.getTaskCount();
      expect(assignedTasks).to.equal(3);
      expect(completedTasks).to.equal(0);
    });
  });

  describe('getImportantTasks', function () {
    it('should return the important tasks', async function () {
      await taskManagement.addTask('Test task 1', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task 1 description'), true);
      await taskManagement.addTask('Test task 2', Math.floor(Date.now() / 1000) + 7200, ethers.utils.id('Test task 2 description'), false);
      await taskManagement.addTask('Test task 3', Math.floor(Date.now() / 1000) + 10800, ethers.utils.id('Test task 3 description'), true);
      const importantTasks = await taskManagement.getImportantTasks();
      expect(importantTasks.length).to.equal(2);
      expect(importantTasks[0].title).to.equal('Test task 1');
      expect(importantTasks[1].title).to.equal('Test task 3');
    });

  });

  describe('getAssignedTasks', function () {
  it('should return the assigned tasks for a member', async function () {
  await taskManagement.addTask('Test task 1', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task 1 description'), true);
  await taskManagement.addTask('Test task 2', Math.floor(Date.now() / 1000) + 7200, ethers.utils.id('Test task 2 description'), true);
  await taskManagement.addTask('Test task 3', Math.floor(Date.now() / 1000) + 10800, ethers.utils.id('Test task 3 description'), true);
    await taskManagement.assignTask(member.address, 0);
  await taskManagement.assignTask(member.address, 1);

  const assignedTasks = await taskManagement.getAssignedTasks(member.address);
  expect(assignedTasks.length).to.equal(2);
  expect(assignedTasks[0].title).to.equal('Test task 1');
  expect(assignedTasks[1].title).to.equal('Test task 2');
});
});

describe('assignTask', function () {
it('should assign a task to a member', async function () {
await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
await taskManagement.assignTask(member.address, 0);
const assignedTasks = await taskManagement.getAssignedTasks(member.address);
expect(assignedTasks.length).to.equal(1);
expect(assignedTasks[0].title).to.equal('Test task');
expect(assignedTasks[0].assignedTo).to.equal(member.address);
});

it('should revert if the task is already assigned', async function () {
await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
await taskManagement.assignTask(member.address, 0);
await expect(taskManagement.assignTask(teamLeader.address, 0)).to.be.revertedWith('TaskManagement: task is already assigned');
});

it('should revert if the task is completed', async function () {
await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
await taskManagement.completeTask(0);
await expect(taskManagement.assignTask(member.address, 0)).to.be.revertedWith('TaskManagement: task is already completed');
});

it('should revert if called by a non-admin', async function () {
await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
await expect(taskManagement.connect(member).assignTask(teamLeader.address, 0)).to.be.revertedWith('AccessControl: sender must be an admin to grant');
});
describe('unassignTask', function () {
  it('should unassign a task', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await taskManagement.assignTask(member.address, 0);
  await taskManagement.unassignTask(0);
  const task = await taskManagement.getTask(0);
  expect(task.assignedTo).to.equal(ethers.constants.AddressZero);
  });
  
  it('should revert if the task is not assigned', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await expect(taskManagement.unassignTask(0)).to.be.revertedWith('TaskManagement: task is not assigned');
  });
  
  it('should revert if called by a non-admin', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await taskManagement.assignTask(member.address, 0);
  await expect(taskManagement.connect(member).unassignTask(0)).to.be.revertedWith('AccessControl: sender must be an admin to revoke');
  });
  });
  
  describe('completeTask', function () {
  it('should complete a task', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await taskManagement.assignTask(member.address, 0);
  await taskManagement.completeTask(0);
  const task = await taskManagement.getTask(0);
  expect(task.completed).to.equal(true);
  });
  
  it('should revert if the task is not assigned', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await expect(taskManagement.completeTask(0)).to.be.revertedWith('TaskManagement: task is not assigned');
  });
  
  it('should revert if called by a non-member', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await taskManagement.assignTask(member.address, 0);
  await expect(taskManagement.connect(teamLeader).completeTask(0)).to.be.revertedWith('TaskManagement: caller is not the assigned member');
  });
  
  it('should revert if the task is already completed', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await taskManagement.assignTask(member.address, 0);
  await taskManagement.completeTask(0);
  await expect(taskManagement.completeTask(0)).to.be.revertedWith('TaskManagement: task is already completed');
  });
  });
  
  });
  it('should revert if called by a non-admin', async function () {
    await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
    await expect(taskManagement.connect(member).unassignTask(teamLeader.address, 0)).to.be.revertedWith('AccessControl: sender must be an admin to revoke');
  });


describe('completeTask', function () {
it('should mark the task as completed', async function () {
await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
await taskManagement.completeTask(0);
const tasks = await taskManagement.getTasks();
expect(tasks[0].completed).to.equal(true);
});
it('should revert if called by a non-admin', async function () {
  await taskManagement.addTask('Test task', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task description'), true);
  await expect(taskManagement.connect(member).completeTask(0)).to.be.revertedWith('AccessControl: sender must be an admin to mark task as complete');
});

});

describe('getCompletedTasks', function () {
it('should return the completed tasks', async function () {
await taskManagement.addTask('Test task 1', Math.floor(Date.now() / 1000) + 3600, ethers.utils.id('Test task 1 description'), true);
await taskManagement.addTask('Test task 2', Math.floor(Date.now() / 1000) + 7200, ethers.utils.id('Test task 2 description'), true);
await taskManagement.addTask('Test task 3', Math.floor(Date.now() / 1000) + 10800, ethers.utils.id('Test task 3 description'), true);
await taskManagement.completeTask(0);
await taskManagement.completeTask(1);

const completedTasks = await taskManagement.getCompletedTasks();
expect(completedTasks.length).to.equal(2);
expect(completedTasks[0].title).to.equal('Test task 1');
expect(completedTasks[0].dueDate).to.equal(Math.floor(Date.now() / 1000) + 3600);
expect(completedTasks[0].descriptionHash).to.equal(ethers.utils.id('Test task 1 description'));
expect(completedTasks[0].important).to.equal(true);
expect(completedTasks[0].completed).to.equal(true);
expect(completedTasks[1].title).to.equal('Test task 2');
expect(completedTasks[1].dueDate).to.equal(Math.floor(Date.now() / 1000) + 7200);
expect(completedTasks[1].descriptionHash).to.equal(ethers.utils.id('Test task 2 description'));
expect(completedTasks[1].important).to.equal(true);
expect(completedTasks[1].completed).to.equal(true);
});

});
});