import { makeObservable, observable, action } from "mobx";
class LocationContext {
  location = null;

  constructor() {
    makeObservable(this, {
      location: observable,
      set: action,
    });
  }

  set = (location) => {
    this.location = location;
  };
}

const locationContext = new LocationContext();
export default locationContext;
