import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const title = await this.repository
      .createQueryBuilder()
      .select()
      .where("title ILIKE :searchTerm", { searchTerm: `%${param}%` })
      .getMany();
    // Complete usando query builder

    return title;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const totalNumberOfGames = await this.repository.query(
      `SELECT COUNT(*) FROM games`
    ); // Complete usando raw query

    return totalNumberOfGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.users", "users")
      .where("game.id = :id", { id: id })
      .getOne();
    // Complete usando query builder

    if (game) {
      return game.users;
    }

    throw new Error("Users not found.");
  }
}
