import { makeObservable, observable, action } from "mobx";
class NovaDenunciaContext {
  novaDenuncia = null;

  constructor() {
    makeObservable(this, {
      novaDenuncia: observable,
      set: action,
    });
  }

  set = (novaDenuncia) => {
    this.novaDenuncia = novaDenuncia;
  };
}

const novaDenunciaContext = new NovaDenunciaContext();
export default novaDenunciaContext;
