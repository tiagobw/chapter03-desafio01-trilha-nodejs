import { getRepository, Repository, Not, IsNull, MoreThan } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.findOne({
      relations: ["games"],
      where: { id: user_id },
    });

    if (user) {
      return user;
    }

    throw new Error("User not found");
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users = await this.repository.query(
      `SELECT * FROM users ORDER BY first_name ASC`
    ); // Complete usando raw query

    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.query(
      `SELECT * FROM users WHERE LOWER(first_name)=LOWER($1) AND LOWER(last_name)=LOWER($2)`,
      [first_name, last_name]
    ); // Complete usando raw query

    return user;
  }
}
