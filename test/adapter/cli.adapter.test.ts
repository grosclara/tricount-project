import 'mocha'
import chai from 'chai';
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import User from '../../src/hexagon/models/User';

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('CliAdapter', () => {

    // var mockUsers: User[];

    // beforeEach('parametrage', () => {
    //     mockUsers = [
    //         new User("Clara"),
    //         new User("Paul"),
    //         new User("Jeanne")
    //     ];
    // });
    
    describe('Start the CLI', () => {
        it.skip('GIVEN a Tricount, WHEN we start the CLI, THEN it should print a welcome message');
        it.skip('GIVEN a new CLI with no previous member, WHEN we start the CLI, THEN it should ask for creating a new Tricount');
        it.skip('GIVEN a Tricount with members, WHEN we start the CLI, THEN it should run the app without asking for the Tricount creation');

    }),
    describe('Create a new Tricount', () => {
        it.skip('GIVEN a new CLI with with no previous member, WHEN one does not want to create a new Tricount, THEN it should print a goodbye message');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to create a new Tricount, THEN it should ask for adding a member to the Tricount');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to validate the Tricount creation with exactly 1 member, THEN it should print a warning message and ask for adding another user');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to add 2 members with the same username, THEN it should print a AlreadyExistingUser error');
        it.skip('[happy path] GIVEN a new CLI with with no previous member, WHEN one adds 2 distinct members and validate, THEN it should print a success message');
    })
    describe('Create a new Tricount', () => {
        it.skip('GIVEN a new CLI with with no previous member, WHEN one does not want to create a new Tricount, THEN it should print a goodbye message');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to create a new Tricount, THEN it should ask for adding a member to the Tricount');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to validate the Tricount creation with exactly 1 member, THEN it should print a warning message and ask for adding another user');
        it.skip('GIVEN a new CLI with with no previous member, WHEN one wants to add 2 members with the same username, THEN it should print a AlreadyExistingUser error');
        it.skip('[happy path] GIVEN a new CLI with with no previous member, WHEN one adds 2 distinct members and validate, THEN it should print a success message');
    })
})