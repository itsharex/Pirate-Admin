import {Body, Controller, Get, HttpStatus, Param, Post, Query, Session,} from '@nestjs/common';
import {AdminService} from './admin.service';
import {UpsertAdminDto} from './dto/upsert-admin.dto';
import {LogCall, ProtocolHost, RealIp, RequireLogin, UserInfo,} from '@/decorators/custom.decorator';
import {LoginAdminDto} from './dto/login-admin.dto';
import {generateParseIntPipe} from '@/utils/tools';
import {QueryAdminDto} from './dto/query-admin.dto';
import {RemoveAdminDto} from './dto/remove-admin.dto';
import {UpsertPermissionDto} from './dto/upsert-permission.dto';
import {RemovePermissionDto} from './dto/remove-permission.dto';
import {IdsDto} from '@/common/dtos/remove.dto';
import {StatusPermissionDto} from './dto/status-permission.dto';
import {UpsertRoleDto} from './dto/upsert-role.dto';
import {QueryRoleDto} from './dto/query-role.dto';
import {VerifyCaptchaDto} from "@/common/captcha/dto/verify-captcha.dto";
import {CaptchaType} from "@/types/enum";
import {ApiBody, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AdminLoginInfoVo} from "@/modules/admin/vo/login-admin.vo";

@ApiTags('Admin') // 将此 API 放在 'Admin' 分类下
// @ApiBearerAuth() // 如果需要认证
@ApiConsumes('application/json') // 指定接收的数据类型
@ApiProduces('application/json') // 指定响应的数据类型
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {
  }

  @ApiOperation({
    summary: '管理员登录',
    description: '管理员使用用户名和密码进行登录',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '成功登录',
    type: AdminLoginInfoVo
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '认证失败',
  })
  @ApiBody({
    description: '管理员登录信息',
    type: LoginAdminDto
  })
  @Post('login')
  @LogCall('admin', '登录')
  public async login(
    @Body() loginUser: LoginAdminDto,
    @Session() session: Record<string, any>,
    @RealIp() ip: string,
    @ProtocolHost() protocolHost: string,
  ) {
    return await this.adminService.login(loginUser, session, ip, protocolHost);
  }

  @Get('refresh')
  @LogCall('admin', 'refresh刷新token')
  public async refreshToken(
    @Query('refreshToken') refreshToken: string,
    @ProtocolHost() protocolHost: string,
  ) {
    return await this.adminService.refreshToken(refreshToken, protocolHost);
  }

  @Get('list')
  @RequireLogin()
  // @LogCall('admin', '管理员管理')
  public async list(
    @Query('page', generateParseIntPipe('page', 1))
      page: number,
    @Query('size', generateParseIntPipe('size', 10))
      size: number,
    @Query() queryAdminDto: QueryAdminDto,
    @ProtocolHost() protocolHost: string,
    @UserInfo('userId') userId: number,
  ) {
    return await this.adminService.list(
      page,
      size,
      queryAdminDto,
      protocolHost,
      userId,
    );
  }

  @Post('upsert')
  @RequireLogin()
  @LogCall('admin', '管理员管理-新增/编辑')
  public async upsert(@Body() createAdminDto: UpsertAdminDto) {
    return await this.adminService.upsert(createAdminDto);
  }

  @Post('remove')
  @RequireLogin()
  @LogCall('admin', '管理员管理-删除')
  public async remove(@Body() body: RemoveAdminDto) {
    return await this.adminService.remove(body);
  }

  @Get('detail/:id')
  @RequireLogin()
  @LogCall('admin', '管理员管理-详情')
  public async detail(
    @Param('id') id: number,
    @ProtocolHost() protocolHost: string,
  ) {
    return await this.adminService.detail(id, protocolHost);
  }

  @Get('bind-captcha')
  @RequireLogin()
  @LogCall('admin', '获取绑定邮箱/手机号验证码')
  public async bindCaptcha(
    @Query('type') type: CaptchaType, // email: 邮箱注册 phone: 手机注册
    @Query('address') address: string, // 邮箱或手机号
  ) {
    return this.adminService.bindCaptcha(type, address)
  }

  @Post('bind-info')
  @RequireLogin()
  @LogCall('admin', '绑定管理员数据')
  public async bindInfo(
    @UserInfo('userId') id: number,
    @Body() bindInfo: VerifyCaptchaDto
  ) {
    return this.adminService.bindInfo(id, bindInfo)
  }

  @Get('role')
  @RequireLogin()
  @LogCall('admin', '角色组管理')
  public async role(@Query() query: QueryRoleDto) {
    return await this.adminService.role(query);
  }

  @Post('role/upsert')
  @RequireLogin()
  @LogCall('admin', '角色组管理-新增/编辑')
  public async roleUpsert(@Body() body: UpsertRoleDto) {
    return await this.adminService.roleUpsert(body);
  }

  @Post('role/remove')
  @RequireLogin()
  @LogCall('admin', '角色组管理-删除')
  public async roleRemove(@Body() body: IdsDto) {
    return await this.adminService.roleRemove(body);
  }

  @Get('role/:id')
  @RequireLogin()
  @LogCall('admin', '角色组管理-详情')
  public async roleDetail(@Param('id') id: number) {
    return await this.adminService.roleDetail(id);
  }

  @Get('menus')
  @RequireLogin()
  // @LogCall('admin', '菜单规则管理')
  public async menus() {
    return await this.adminService.menus();
  }

  @Post('menu/upsert')
  @RequireLogin()
  @LogCall('admin', '菜单规则管理-新增/编辑')
  public async menuUpsert(@Body() body: UpsertPermissionDto) {
    return await this.adminService.menuUpsert(body);
  }

  @Post('menu/remove')
  @RequireLogin()
  @LogCall('admin', '菜单规则管理-删除')
  public async menuRemove(@Body() body: RemovePermissionDto) {
    return await this.adminService.menuRemove(body);
  }

  @Get('menu/:id')
  @RequireLogin()
  @LogCall('admin', '菜单规则管理-详情')
  public async menuDetail(@Param('id') id: number) {
    return await this.adminService.menuDetail(id);
  }

  @Post('menu/status')
  @RequireLogin()
  @LogCall('admin', '菜单规则管理-修改状态')
  public async menuStatus(@Body() body: StatusPermissionDto) {
    return await this.adminService.menuStatus(body);
  }

  @Get('menu/sortable/:id/:targetId')
  @RequireLogin()
  @LogCall('admin', '菜单规则管理-排序')
  public async menuSortable(
    @Param('id') id: number,
    @Param('targetId') targetId?: number,
  ) {
    return await this.adminService.menuSortable(id, targetId);
  }
}
