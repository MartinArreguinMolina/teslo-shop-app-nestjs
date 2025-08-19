import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload-interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      // Guardar el usuario
      await this.userRepository.save(user);

      const { password: pass, ...data } = user;

      // Lo voy a auntenticar
      // TODO RETORNAR JWT DE ACCESO

      return {
      ...user,
      token: this.getJwtToken({id:user.id})
    };
    
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async login(loginuserDto: LoginUserDto) {

    const { email, password } = loginuserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true , id: true}
    })


    if (!user) 
      throw new UnauthorizedException('Credentials are not validm (email)')
    

    // Comparar las contraseñas encriptadas
    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)')



    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    };
    // TODO: RETORNAR EL JWT
  }


  async checkAuthStatus(user: User){

    return {
      ...user,
      token: this.getJwtToken({id:user.id})
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }

    console.log(error);

    throw new InternalServerErrorException('Place check server logs')
  }

  // Generar el JWT
  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }



  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
