import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@ApiTags('auth')
@ApiResponse({ status: 201, description: 'Successfully Login.'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
@Controller('auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    // return await this.loginService.login(loginDto);
  }
}
