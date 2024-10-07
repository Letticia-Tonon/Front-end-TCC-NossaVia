import { makeObservable, observable, action } from "mobx";
class UserContext {
  user = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      set: action,
    });
  }

  set = (userInfo) => {
    this.user = userInfo;
  };
}

const userContext = new UserContext();
export default userContext;
