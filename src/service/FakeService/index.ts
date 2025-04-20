import fakeLogin from "../../api";
import { User } from "../../types/user";

export class FakeService {

  static async make(email: string, password: string): Promise<boolean> {
    const data: User = await fakeLogin;

    return email === data.email && password === data.password;
  }

};