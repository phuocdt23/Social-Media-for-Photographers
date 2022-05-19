import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordService } from './forgot-password.service';

@ApiTags('auth')
@Controller('auth/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  public async forgotPassword(
    @Res() res,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const rs = await this.forgotPasswordService.forgotPassword(
      forgotPasswordDto,
    );
    return res.status(rs.response.statusCode).json(rs.response);
  }
}
