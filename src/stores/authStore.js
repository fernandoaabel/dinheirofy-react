import { observable, action } from 'mobx';
import agent from '../agent';
import userStore from './userStore';
import commonStore from './commonStore';

class AuthStore {
   @observable inProgress = false;
   @observable errors = undefined;

   @observable values = {
      username: '',
      email: '',
      password: ''
   };

   @action setUsername(username) {
      this.values.username = username;
   }

   @action setEmail(email) {
      this.values.email = email;
   }

   @action setEmailRegister(email) {
      this.inProgress = true;
      this.values.email = email;
      if (email) {
         agent.Auth.exists(email)
            .then((res) => {
               if (res.text === 'true') {
                  this.errors = ['Email already exists'];
               } else {
                  this.errors = undefined;
               }
            })
            .finally(() => (this.inProgress = false));
      }
   }

   @action setPassword(password) {
      this.values.password = password;
   }

   @action reset() {
      this.values.username = '';
      this.values.email = '';
      this.values.password = '';
   }

   @action login() {
      this.inProgress = true;
      this.errors = undefined;
      return (
         agent.Auth.login(this.values.email, this.values.password)
            .then((res) => {
               const authToken = res.body['accessToken'];
               if (authToken) commonStore.setToken(authToken);
            })
            //.then(({ user }) => commonStore.setToken(user.token))
            //.then(() => userStore.pullUser())
            .catch(
               action((err) => {
                  this.errors = err.response && err.response.body && err.response.body.errors;
                  throw err;
               })
            )
            .finally(
               action(() => {
                  this.inProgress = false;
               })
            )
      );
   }

   @action async register() {
      this.inProgress = true;
      this.errors = undefined;

      return (
         agent.Auth.register(this.values.username, this.values.email, this.values.password)
            //.then(({ user }) => commonStore.setToken(user.token))
            //.then(this.login())
            .catch(
               action((err) => {
                  this.errors = err.response && err.response.body && err.response.body.errors;
                  throw err;
               })
            )
            .finally(
               action(() => {
                  this.inProgress = false;
               })
            )
      );
   }

   @action logout() {
      commonStore.setToken(undefined);
      userStore.forgetUser();
      return Promise.resolve();
   }
}

export default new AuthStore();
