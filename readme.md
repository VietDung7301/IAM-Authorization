# Identity and access management
Module authorization của IAM project

### Cách cài đặt
#### 1. Clone repository này về
```
git clone https://github.com/VietDung7301/IAM-Authorization.git
cd IAM-Authorization
```
#### 2. Cài đặt và khởi tạo virtual environment:
```
pip install --user pipenv
pipenv shell
```
#### 3. Cài đặt các thư viện:
```
pipenv install
```
#### 4. Sửa file .env
Copy file `.env.example` ra 1 file mới, đặt tên là `.env` và sửa các giá trị
#### 5. Tạo biến môi trường
Đối windows
```
$env:FLASK_APP="server"
$env:FLASK_ENV="development"
```
Với linux
```
export FLASK_APP=server
export FLASK_ENV=development
```
#### 5. Migrate database
Chạy lệnh sau để migrate dữ liệu (tạo ra 1 file migration)
```
flask db migrate
```
Sau đó update lại database dựa vào file đó
```
flask db upgrade
```
Để xem thêm các lệnh khác (trong trường hợp nó bị lỗi :) )
```
flask db --help
```
#### 6. Khởi động server:
```
flask run
```
chạy bằng lệnh phía trên được khuyên dùng hơn, tuy nhiên nếu chạy trên windows bị lỗi thì có thể chạy bằng lệnh sau:
```
python server.py
```