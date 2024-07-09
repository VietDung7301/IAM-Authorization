
exports.getStudents = async (req, res) => {
	res.status(200).json({
		status_code: true,
		messages: "Get success",
		data: {
			student_list: [
				{
					name: 'arun',
					gender: 'Male',
					physics: 88,
					maths: 87,
					english: 78
				},
				{
					name: 'rajesh',
					gender: 'Male',
					physics: 96,
					maths: 100,
					english: 95
				},
				{
					name: 'moorthy',
					gender: 'Male',
					physics: 89,
					maths: 90,
					english: 70
				},
				{
					name: 'raja',
					gender: 'Male',
					physics: 30,
					maths: 25,
					english: 40
				},
				{
					name: 'usha',
					gender: 'Female',
					physics: 67,
					maths: 45,
					english: 78
				},
				{
					name: 'priya',
					gender: 'Female',
					physics: 56,
					maths: 46,
					english: 78
				},
				{
					name: 'Sundar',
					gender: 'Male',
					physics: 12,
					maths: 67,
					english: 67
				},
				{
					name: 'Kavitha',
					gender: 'Female',
					physics: 78,
					maths: 71,
					english: 67
				},
				{
					name: 'Dinesh',
					gender: 'Male',
					physics: 56,
					maths: 45,
					english: 67
				},
				{
					name: 'Hema',
					gender: 'Female',
					physics: 71,
					maths: 90,
					english: 23
				},
				{
					name: 'Gowri',
					gender: 'Female',
					physics: 100,
					maths: 100,
					english: 100
				},
				{
					name: 'Ram',
					gender: 'Male',
					physics: 78,
					maths: 55,
					english: 47
				},
				{
					name: 'Murugan',
					gender: 'Male',
					physics: 34,
					maths: 89,
					english: 78
				},
				{
					name: 'Jenifer',
					gender: 'Female',
					physics: 67,
					maths: 88,
					english: 90
				}
			]
		}
	})
}

exports.getStudentById = async (req, res) => {
	let id = req.params.id
	if (id == '1') {
		res.status(200).json({
			name: 'Hoàng Việt Dũng',
			date_of_birth: '01-01-2001',
			email: 'dung.hv190092@sis.hust.edu.vn',
			phone_number: '0123456789',
			sex: 'male',
			cpa: '3.00',
			address: 'Mỹ Hào, Hưng Yên',
			profile_picture: 'https://lh3.googleusercontent.com/a/ACg8ocJfEhyMsLFgxNOPsQks7C5GvBGTul1YU-Nunh8MfkYyi0MxxFHS=s360-c-no',
			cover_picture: 'https://i.pinimg.com/736x/9e/1a/a6/9e1aa6905e2b8cdf40fec166972d2836.jpg'
		})
	} else {
		res.status(200).json({
			name: 'Lương Nguyễn Hoàng Anh',
			date_of_birth: '02-02-2001',
			email: 'anh.lnh190000@sis.hust.edu.vn',
			phone_number: '0987654321',
			sex: 'male',
			cpa: '3.99',
			address: 'Hai Bà Trưng, Hà Nội',
			profile_picture: 'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.6435-9/49271337_2318600335038588_8426942601751429120_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeFLltoD4cXzgFDIWEB5MEhP0BJRP54XKHDQElE_nhcocLraPlfh6XetFWxdHTNnbo9xgSqRqrcT7c5WG6zDqVFe&_nc_ohc=rEQY3xwsn50Q7kNvgGMgsQi&_nc_ht=scontent.fhan18-1.fna&oh=00_AYB6IbyOWyQj1Eog2XZy_gev2tOp_R3GaF2e29yRmOKjbA&oe=66B4A0AE',
			cover_picture: 'https://scontent.fhan18-1.fna.fbcdn.net/v/t1.6435-9/101225983_2733741326857818_4222293610378297344_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=2a1932&_nc_eui2=AeHCb_lJ5wyT-badH2xJnlyqQkUR5t3SoLhCRRHm3dKguBOu0w3-tvVMgeMbTgY4loafrLMCKbCiT5plwaxesVnc&_nc_ohc=EcMdFtXgc6wQ7kNvgEtxf4I&_nc_ht=scontent.fhan18-1.fna&oh=00_AYD6wrf_ObKVr8lx8-80nzgRjNX6c3-xpr9WgU_gZUuicg&oe=66B48349'
		})
	}
}