# Angular 11 / ASP.NET Core 3.1 / Spring Boot 2.3 with Kotlin / DRF 3.11

개인적인 공부를 위해 간단한 쇼핑몰 샘플을 제작한 프로젝트입니다.

그동안 SPA를 통한 프론트엔드 구현과 SPA-백엔드 간의 통신, 그리고 ASP.NET Core 3.1 등의 최신 ASP.NET Core 구현과 Spring Boot, Django Rest Framework(이하 DRF)등의 구현에 대해 궁금했기에 궁금증을 해소하기 위해서 프로젝트를 진행하게 되었습니다.

Angular 11으로 프론트엔드가 구현되었으며 동일한 프론트엔드에 대해 같은 기능을 하는 백엔드를 각각 ASP.NET Core 3.1, Spring Boot 2.3(Kotlin), DRF 3.11로 구현하였습니다.
(DRF의 경우 속성명을 캐멀 케이스 대신에 스네이크 케이스를 사용하는 탓에 Angular 프로젝트가 구분되어 있습니다.)

처음에는 책 형태로 정리하려고 생각했었기에 소스코드가 책의 각 챕터에 해당하도록 구성되어 있으며, 각 챕터의 내용은 https://blog.naver.com/netscout82/221993591322 에서 확인하실 수 있습니다.

시간의 여유가 없었기에 정리된 내용은 자세한 내용보다는 '그냥 이런 식으로 진행한다' 느낌 정도로 정리되었음을 양해부탁드립니다.

# 소스코드 실행 방법

소스 코드를 실행하는 방법은 우선 MySQL 데이터 베이스를 설정하고 3개의 백엔드 중 확인하고 싶은 프로젝트를 골라서 백엔드 프로젝트를 구성하는 것입니다. 그리고 마지막으로 Angular 프로젝트를 구성하여 프로젝트를 확인할 수 있습니다.

최종 완성 프로젝트는 chapter9 폴더 안의 프로젝트를 사용합니다.

```bash
cd chapter9\AngularShop
```

## 데이터베이스 설정

데이터 베이스는 Docker-Compose 를 통해 MySQL을 사용합니다. Docker-Compose는 [Docker Desktop] 을 설치하면 같이 설치됩니다.

프로젝트의 루트 폴더에 docker-compose.yaml 파일이 있으므로 다음 커맨드를 통해 MySQL을 실행합니다.

[Docker Desktop]: https://www.docker.com/products/docker-desktop "Docker Desktop 다운로드"

```bash
docker-compose up -d
```

처음 MySQL 이미지를 다운로드 하고 실행하는데 1-2분 또는 그 이상 소요될 수 있습니다.

구성된 데이터 베이스 정보는 다음과 같습니다.
(단순 개발용 DB이므로 패스워드는 대충 정했습니다 ;))

```
데이터베이스 : AngularShop
루트 계정 패스워드 : 123456
사용자 계정 : user
사용자 계정 패스워드 : 1234
```

데이터베이스는 [HeidiSQL]등의 도구를 통해 확인가능합니다.

[HeidiSQL]: https://www.heidisql.com/ "HeidiSQL 다운로드"

HeidiSQL을 통해 데이터베이스에 접속 할 때 __Authentication plugin 'caching_sha2_password' cannot be loaded__ 에러가 발생한다면, __docker ps__ 명령을 통해 MySQL이 실행 중인 컨테이너 이름을 확인하고, 이름을 이용해서 Docker 컨테이너에서 실행 중인 MySQL에 접속하여 쿼리를 실행합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop>docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS         PORTS                               NAMES
8b84fd03c7f0   mysql     "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:3306->3306/tcp, 33060/tcp   angularshop_db_1

C:\Sources\AngularShop_sources\chapter9\AngularShop>docker exec -it angularshop_db_1 mysql --user=root --password
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 19
Server version: 8.0.23 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> ALTER USER 'user' IDENTIFIED WITH mysql_native_password BY '1234';
Query OK, 0 rows affected (0.03 sec)

mysql> ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '123456';
Query OK, 0 rows affected (0.03 sec)

mysql> exit
Bye
```

## ASP.NET Core 백엔드 구성

### .NET Core SDK 설치

기존의 .NET은 윈도우 기반의 .Net Framework 4.8, 크로스 플랫폼 .NET Core 3.1 으로 나뉘어 있었지만, 둘을 합쳐서 크로스 플랫폼 기반의 .NET 5로 통합되었습니다.

이 프로젝트에서는 .NET Core 3.1을 사용하고 있으므로 [.NET Core SDK] 중에서 3.1 버전 SDK를 다운로드 하여 설치합니다.

[.NET Core SDK]: https://dotnet.microsoft.com/download ".NET Core SDK 다운로드"

설치 후 다음 명령을 통해 SDK의 버전을 확인합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop>dotnet --version
3.1.405
```

### 데이터베이스 마이그레이션 및 실행

본 프로젝트에서는 Entity Framework Cor 3.1의 Code First를 통해 데이터베이스 코드가 작성되었습니다. 그러므로 작성된 모델 코드에서 데이터베이스를 생성하기 위해 dotnet-ef를 설치합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop>dotnet tool install --global dotnet-ef
다음 명령을 사용하여 도구를 호출할 수 있습니다. dotnet-ef
'dotnet-ef' 도구('5.0.2' 버전)가 설치되었습니다.
```

그리고 다음 명령을 통해 데이터베이스를 생성합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop>dotnet ef database update
Build started...
Build succeeded.
Done.
```

만약 데이터베이스 접속 정보가 기본 설정과 다른 경우 appsettings.Development.json 파일의 연결문자열을 수정해야 합니다.

데이터베이스 복원 완료 후 다음 명령을 통해 프로젝트를 실행합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop>dotnet run
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop
```

브라우저로 https://localhost:5001 으로 접속하면 Swagger 페이지를 확인할 수 있습니다.
```
Ad Block이 설정된 브라우저의 경우 호출에 문제가 발생할 수 있습니다.
그리고 꼭 https를 사용하는 https://localhost:5001로 접속 해서 테스트 하시기 바랍니다.
```

Seed파트의 CreateDefaultUsers, CreateSampleProducts를 한 번씩 실행하여 기본 데이터를 생성합니다. 

HeidiSQL을 통해 생성된 데이터가 확인 되면 백엔드 준비가 완료되었습니다.

## Spring Boot 프로젝트 구성

본 프로젝트는 OpenJDK 1.8 버전, Kotlin 그리고 Gradle을 사용해 구성되었습니다.

Spring Boot 코드가 준비된 AngularShopBoot 폴더로 이동합니다.

```bash
C:\Sources>cd AngularShop_sources\chapter9\AngularShop\AngularShopBoot
```

### OpenJDK 설치

[환경구성 참고 자료]를 확인하면 아래 과정을 스크린샷과 함께 확인할 수 있습니다.

[OpenJDK] 다운로드 페이지로 이동하여 OpenJDK8 (LTS) 그리고 HotSpot, Windows, x64를 선택하고 .msi 파일을 다운로드 합니다.

[OpenJDK]: https://adoptopenjdk.net/releases.html "OpenJDK 다운로드"
[환경구성 참고 자료]: https://blog.naver.com/PostView.nhn?blogId=netscout82&logNo=221993603664&parentCategoryNo=&categoryNo=100&viewDate=&isShowPopularPosts=false&from=postView "환경구성 참고자료"

설치 도중에 "Set JAVA_HOME variable" 항목을 꼭 선택하고 설치를 진행합니다.

설치를 마친 후에 다음 명령어로 JDK 버전을 확인합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopBoot>java -version
openjdk version "1.8.0_282"
OpenJDK Runtime Environment (AdoptOpenJDK)(build 1.8.0_282-b08)
OpenJDK 64-Bit Server VM (AdoptOpenJDK)(build 25.282-b08, mixed mode)
```

### Spring Boot 프로젝트 실행

우선 업로드되는 이미지가 저장될 images폴더의 경로를 설정해줍니다. __WebConfig.kt__ 에서 __images/**__ 와 매핑되는 폴더를 현재 폴더 위치와 맞게 설정합니다.

```kotlin
class WebConfig : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:///c:/Sources/AngularShop_sources/chapter9/AngularShop/images/")
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("/resources/")
    }
}
```

다음 명령을 통해 프로젝트를 실행합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopBoot>gradlew bootrun

> Task :bootRun

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.3.0.RELEASE)

....중략....

2021-02-06 15:22:18.379  INFO 6260 --- [nio-8080-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 0 ms
<==========---> 80% EXECUTING [55s]
> :bootRun

```

초기 데이터 생성을 위해 브라우저에서 다음 주소를 통해 API를 호출합니다.

```
http://localhost:8080/api/Seed/GenerateProducts
http://localhost:8080/api/Seed/GenerateUsers
```

HeidiSQL을 통해 데이터가 확인되었다면 백엔드 준비가 완료되었습니다.

## Django Rest Framework 프로젝트 구성

DRF 코드가 준비된 AngularShopDRF 폴더로 이동합니다.

```bash
C:\Sources>cd AngularShop_sources\chapter9\AngularShop\AngularShopDRF
```

### Python 설치

[Python 3.7.9 다운로드 페이지]로 이동하여 x64 Installer를 다운로드 하여 설치합니다.

[Python 3.7.9 다운로드 페이지]: https://www.python.org/downloads/release/python-379/ "Python 3.7.9 다운로드"

설치 중에 __Add Python 3.7 to PATH__ 옵션을 꼭 체크하고 설치를 진행해야 합니다.

다음 명령어로 파이선 버전을 확인합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop>python -V
Python 3.7.9
```

그리고 다음 명령어를 통해 가상환경 설정 및 패키지를 설치합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopDRF>python -m venv venv

C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopDRF>venv\Scripts\activate

(venv) C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopDRF>pip install -r requirements.txt
```

### 데이터베이스 구성

다음 명령어를 통해 코드로 작성된 모델을 데이터베이스에 반영합니다.

```bash
(venv) C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopDRF>python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, shop
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0001_initial... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying shop.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying sessions.0001_initial... OK
  Applying shop.0002_userlogin... OK
  Applying shop.0003_order_orderitem_orderstatus... OK
```

### 프로젝트 실행

우선 관리자 계정을 생성하기 위해 다음 명령을 실행합니다. 코드에서 사용하는 기본 패스워드는 __qwerty1@__ 입니다.

```bash
(venv) C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopDRF>python manage.py createsuperuser
Email: admin@email.com
Username: admin
Password:
Password (again):
Superuser created successfully.
```

이어서 다음 명령어로 프로젝트를 실행합니다.

```bash
(venv) C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShopDRF>python manage.py runserver
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
February 07, 2021 - 13:13:08
Django version 3.0.7, using settings 'AngularShopDRF.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

브라우저를 통해 다음 URL을 호출하여 초기 제품 데이터와 기본 사용자 데이터를 생성합니다.

```
http://127.0.0.1:8000/api/seed/generate-products
http://127.0.0.1:8000/api/seed/generate-users
```

생성된 사용자 및 제품 데이터가 확인되면 프로젝트 구성이 완료되었습니다.

## Angular 프로젝트 구성

Angular 프로젝트는 .NET, Spring Boot 백엔드를 위한 __AngularShop-Front__ 프로젝트와 DRF 백엔드를 위한 __AngularShop-Fron-DRF__ 프로젝트가 있습니다.

두 프로젝트의 설정 방법은 모두 동일합니다.

### Node.js 설치

Node.js는 [Node Version Manager For Windows]를 통해 설치를 진행합니다.

[Node Version Manager For Windows]: https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7 "Node Verion Nanager For Windows 다운로드"

```bash
(venv) C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front>nvm install 14.15.4
Downloading node.js version 14.15.4 (64-bit)...
Complete
Creating C:\Users\netsc\AppData\Roaming\nvm\temp

Downloading npm version 6.14.10... Complete
Installing npm v6.14.10...

Installation complete. If you want to use this version, type

nvm use 14.15.4

C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front>nvm use 14.15.4
Now using node v14.15.4 (64-bit)
```

### Node 패키지 설치

다음 명령어로 필요한 Node 패키지를 설치합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front>npm install -g @angular/cli


C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front>npm i
```

#### Angular 프로젝트 실행하기 - .NET Core

ASP.NET Core는 개발 환경에서 Angular 프로젝트와의 연동을 위해 ASP.NET Core 백엔드로 오는 요청을 Angular 프로젝트로 전달하는 서버 -> 프론트 방식의 프록시 설정을 사용합니다. 자세한 내용은 [Proxy 설정 참고자료]를 참고하면 확인할 수 있습니다.

[Proxy 설정 참고자료]: https://blog.naver.com/PostView.nhn?blogId=netscout82&logNo=221994628963&parentCategoryNo=&categoryNo=100&viewDate=&isShowPopularPosts=false&from=postView "Proxy 설정 참고자료"

__/src/environments/environment.ts__ 파일의 __baseUrl__ 속성 값을 .NET Core의 주소로 설정해줍니다.

```javascript
export const environment = {
  production: false,
  baseUrl: "https://localhost:5001/"
};
```

그리고 다음 명령어를 통해 Angular 프로젝트를 실행합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front>ng serve
```

그리고 __https://localhost:5001/index__ 을 통해 Angular 앱에 접속하면 페이지를 확인할 수 있습니다.

#### Angular 프로젝트 실행하기 - Spring Boot

Spring Boot는 Angular앱으로 들어오는 요청을 백엔드로 전달하는 방식의 프록시를 사용합니다.

자세한 내용은 [Spring Boot Proxy 설정 참고자료]를 참고하면 확인할 수 있습니다.

[Spring Boot Proxy 설정 참고자료]: https://blog.naver.com/netscout82/221994635036 "Proxy 설정 참고자료"

__/src/environments/environment.ts__ 파일의 __baseUrl__ 속성 값을 Angular앱의 주소로 설정해줍니다.

```javascript
export const environment = {
  production: false,
  baseUrl: "http://localhost:4200/"
};
```

그리고 다음 명령어를 통해 Angular 프로젝트를 실행합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front>ng serve --proxy-config=proxy.conf.json
```

그리고 __https://localhost:4200__ 을 통해 Angular 앱에 접속하면 페이지를 확인할 수 있습니다.

#### Angular 프로젝트 실행하기 - DRF

DRF는 Angular앱으로 들어오는 요청을 백엔드로 전달하는 방식의 프록시를 사용합니다.

자세한 내용은 [DRF Proxy 설정 참고자료]를 참고하면 확인할 수 있습니다.

[DRF Proxy 설정 참고자료]: https://blog.naver.com/netscout82/222008503417 "Proxy 설정 참고자료"

그리고 다음 명령어를 통해 Angular 프로젝트를 실행합니다.

```bash
C:\Sources\AngularShop_sources\chapter9\AngularShop\AngularShop-Front-DRF>ng serve --proxy-config=proxy-drf.conf.json
```

그리고 __https://localhost:4200__ 을 통해 Angular 앱에 접속하면 페이지를 확인할 수 있습니다.
