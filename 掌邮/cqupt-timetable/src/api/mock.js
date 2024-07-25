import Mock from 'mockjs';
import homeApi from './mockTimetable/home'

 Mock.mock(/api\/home\/getTimetable/,"get",homeApi.getTimetable);
