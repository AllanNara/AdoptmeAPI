import { documentUserFields } from "../utils/index.js";
import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  }

  getUserByEmail = (email) => {
    return this.getBy({ email });
  };
  getUserById = (id) => {
    return this.getBy({ _id: id });
  };
  updateUserByEmail = (email, doc) => {
    return this.update({ email }, doc);
  };

  uploadDocuments = async (id, files) => {

    const newDocs = [];
    for (let i = 0; i < documentUserFields.length; i++) {
      let name = documentUserFields[i];
      if (!files[name] || !files[name][0]) continue;
      newDocs.push({ name, reference: files[name][0]["path"] });
    }

    const keys = newDocs.map((doc) => doc.name);
    await this.dao.updateSubdocs(id, {
      $pull: { documents: { name: { $in: keys } } },
    });
    const addNewDoc = await this.dao.updateSubdocs(id, {
      $push: { documents: { $each: newDocs } },
    });
    return addNewDoc;
  };

  // uploadDocuments = async (id, files) => {
  //   const newDocs = {};

  //   for (let i = 0; i < documentUserFields.length; i++) {
  //     let name = documentUserFields[i];
  //     if (!files[name] || !files[name][0]) continue;
  //     newDocs[name] = { name, reference: files[name][0]["path"] };
  //   }

  //   const keys = Object.keys(newDocs);
  //   const user = await this.getUserById(id);
  //   const documentMap = new Map(user.documents.map((doc) => [doc.name, doc]));

  //   keys.forEach((key) => documentMap.set(key, newDocs[key]))

  //   return this.update(id, { documents: Array.from(documentMap.values()) });
  // };
}
