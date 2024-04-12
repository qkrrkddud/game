//캔버스 세팅 및 이미지 로딩
const canvas = document.createElement("canvas") //캔버스생성
const ctx = canvas.getContext("2d") //getContext를 2d파일로 생성

//캔버스의 크기 설정
canvas.width = 400;
canvas.height = 700;
//생성한 캔버스를 body요소의 자식으로 추가
document.body.appendChild(canvas);

//이미지 파일들 불러오기
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameoverImage;

//우주선 좌표
let spaceshipX = canvas.width / 2 - 22;
let spaceshipY = canvas.height - 40;

//gameover변수값이 true면 게임이 끝나고, false면 게임이 계속된다
let gameOver = false;

//목숨값을 담을변수
let life = 3;

//총알들을 저장하는 리스트
let bulletList = [];

//총알을 만들기위한 재료가 담긴 함수
function Bullet() {
  this.x = 0;
  this.y = 0;
  //init x, y값을 우주선 x,y값으로 초기화
  this.init = function () {
    //우주선 중앙으로 총알위치를 정렬하기 위해 17을 더해줌
    this.x = spaceshipX + 17
    this.y = spaceshipY;
    //총알이 살아있으면 true, 제거할 때는 false
    this.alive = true;
    //생성된 총알(this)을 bulletList에 넣어줌
    bulletList.push(this);
  }
  //총알의 y축 값에 7을 빼서 값만큼 위로 이동시키는 함수
  this.update = function () {
    this.y -= 7
  }
  //총알이 적군을 맞췄을떄
  this.checkHit = function () {
    //적군의 갯수만큼반복
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y >= enemyList[i].y &&
        this.y <= enemyList[i].y + 40 &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        //총알이 사라짐
        this.alive = false;
        //적군이 죽음 
        enemyList.splice(i, 1);//enemyList에서 총알이 맞춘 적은 1개 제거
      }
    }
  }
}

//매개변수 min과 max범위안의 랜덤숫자를 생성하는 함수
function generateRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//적군을 만들기위한 재료가 담긴 함수
let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    //alive가 true면 적군이 살아있고 false면 적군이 죽은것(제거)
    this.alive = true;
    //x축은 랜덤으로 적용하기 위해 랜덤 숫자를 뽑아내는 함수를 호출
    this.x = generateRandomValue(0, canvas.width - 40);
    //생성한 적군을 배열에 할당
    enemyList.push(this);
  }
  //적군이 y축으로 2씩 아래로 이동하는 함수
  this.update = function () {
    this.y += 2;
    //적군의 위치가 우주선과 닿으면
    if (
      this.y + 30 >= spaceshipY &&
      this.y <= spaceshipY + 40 &&
      this.x + 40 >= spaceshipX &&
      this.x <= spaceshipX + 44
    ) {
      this.alive = false;
      //life값에서 1을 빼서 life가 0이하가되면 gameOver변수값을 true변경
      life--;
      if (life <= 0) {
        gameOver = true;
        //   console.log(gameOver)
      }
    }
  }
}

//방향키를 누르면 비행기가 좌우로 움직이는 이벤트
//객체로 event.key값 저장
let keysDown = {};
//키보드 이벤트리스너를 담을 함수
function setupkeyboardListner() {
  //키보드 버튼을 눌렀을때
  document.addEventListener("keydown", function (event) {
    //console.log(event.keyCode);
    //눌린 키코드(오른쪽:39,왼쪽:37,위:38,아래,40,spacebar:32)

    //누른 키값을 저장
    keysDown[event.key] = true;
    //console.log("keydown",keysDown);
    //눌린 키값은 왼쪽화살표(ArrowLeft), 오른쪽화살표(ArrowRight)
    //spacebar(" ")
  });
  //키보드버튼을 눌렀다 뗐을때
  document.addEventListener("keyup", function (event) {
    //키를 뗐을때 키값 삭제
    delete keysDown[event.key];
    //console.log("keyup",keysDown)
    if (event.key == " ") { // 스페이스바를 눌렀다 떼었을때 
      createBullet(); //총알 생성 함수를 호출
    }
  })
}

//총알을 인스턴스로 생성하는 함수
function createBullet() {
  //console.log("총알 발사")
  let b = new Bullet(); //총알 객체 생성
  b.init(); //init으로 x,y값을 우주선의 x,y값으로 초기화
  //console.log(bulletList)
}

//적군을 인스턴스로 생성되는 함수
function createEnemy() {
  //1초마다 적군 생성
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000)

}

//좌표의 값을 업데이트하는 함수
function update() {
  //우주선의 오른쪽 이동
  if ("ArrowRight" in keysDown) {//keysDown객체의 프로퍼티키로 ArrowRight가 있으면 실행
    spaceshipX += 4;
  }
  //우주선의 왼쪽 이동
  if ("ArrowLeft" in keysDown) {//keysDown객체의 프로퍼티키로 ArrowRight가 있으면 실행
    spaceshipX += -4;
  }

  //캔버스 x좌표 왼쪽, 오른쪽으로 넘어가지 않게 만듬
  if (spaceshipX <= 0) {
    spaceshipX = 0; //spaceshipX의 값이 음수가 나오지 않음
  }
  if (spaceshipX >= canvas.width - 44) {
    spaceshipX = canvas.width - 44 //spaceshipX의 값이 canvas.width-44보다 커지지않음
  }
  let i;
  //총알의 y좌표 업데이트하는 함수 호출
  for (i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      //총알의 갯수만큼 반복호출
      //발사한 모든 총알을 update 함수로 y축으로 -7만큼 계속이동시킴
      bulletList[i].update();
      //해당 총알이 checkHit함수로 적군을 맞췄는지 확인
      bulletList[i].checkHit();
    }
  }
  //적군의 y좌표를 업데이트 하는 함수
  for (i = 0; i < enemyList.length; i++) {
    //적군이 살아있을때만 update적용
    if (enemyList[i].alive) {
      enemyList[i].update();
    }
  }
}

//이미지를 불러오는 함수
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "img/background.png"

  spaceshipImage = new Image();
  spaceshipImage.src = "img/spaceship.png"

  enemyImage = new Image();
  enemyImage.src = "img/enemy.png"

  bulletImage = new Image();
  bulletImage.src = "img/bullet.png"

  gameoverImage = new Image();
  gameoverImage.src = "img/gameover.png"
}

//캔버스에 그리는 함수
function render() {
  //배경이미지
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  //우주선이미지
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  //목숨 표시
  ctx.fillText(`목숨:${life}`, 10, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  let i;
  //총알은 여러개가 발사되므로 for문으로 생성
  for (i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      //총알의 갯수만큼 반복
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
    }
  }

  //적군도 여러개가 생성되므로 for문 작성
  for (i = 0; i < enemyList.length; i++) {
    //적군의 alive값이 true면 적군 이미지를 캔버스에 표시
    if (enemyList[i].alive) {
      ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y)
    }

  }
};

//render함수를 계속 실행시켜주는 함수
function main() {
  //gameOver 변수값이 true면 함수를 호출하지 않는다
  if (!gameOver) {
    update();//좌표값을 업데이트하는 함수를 호출
    render();//그려주기
    requestAnimationFrame(main); //main을 계속 호출해서 보여주는 메서드
  } else {//게임이 종료되면 gameover이미지를 표시
    ctx.drawImage(gameoverImage, 25, 100, 350, 260)
  }
};

//로드이미지 함수 호출하여 이미지 생성
loadImage();

//키보드 이벤트 함수들을 호출
setupkeyboardListner();

//적군생성하는 함수 호출
createEnemy();

//main함수 호출
main();