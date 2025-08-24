import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class ApiCallService {

  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Credentials', 'true')
    .set('language', 'es');
  baseUrl = environment.baseUrl;
  s3Endpoint = environment.s3Url;
  constructor(private http: HttpClient) {
  }

  getToken() {
    return localStorage.getItem('SDtoken');
  }

  s3upload(user: any) {
    return this.http
      .post<any>(`${this.s3Endpoint}/upload`, user);
  }

  sendOTP(user: any) {
    return this.http
      .post<any>(`${this.baseUrl}/auth/sendOtp`, user);
  }

  signUp(user: any) {
    return this.http
      .post<any>(`${this.baseUrl}/auth/createUser`, user);
  }

  profileUpdate(user: any, id: any) {
    const headers = new HttpHeaders()
      .set('userId', id)
    return this.http
      .post<any>(`${this.baseUrl}/update`, user,
        { headers: headers });
  }

  verifyOTP(user: any) {
    return this.http
      .post<any>(`${this.baseUrl}/auth/verifyOtp`, user);
  }

  getMotorCategory(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/motor`);
  }

  getMotorSubCateg(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/motorCategory/${id}`);
  }

  getMotorSubSubCateg(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/motorSubCategory/${id}`);
  }

  motorPostLevel1(data: any) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/motorPost`, data,
        { headers: headers });
  }

  motorPostLevelUpdate(data: any, id) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/motorPost/${id}`, data,
        { headers: headers });
  }

  getCarMakes(type): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
    return this.http.get<any>(`${this.baseUrl}/brand`,
      { params: params });
  }
  getCarModel(id: any, type): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
    return this.http.get<any>(`${this.baseUrl}/model/${id}`,
      { params: params });
  }

  getBikeMakes(type): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
    return this.http.get<any>(`${this.baseUrl}/brand`,
      { params: params });
  }

  getBikeModel(id: any, type): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
    return this.http.get<any>(`${this.baseUrl}/model/${id}`,
      { params: params });
  }
  getTrim(makeId, modelId): Observable<any> {
    const params = new HttpParams()
      .set('makeId', makeId)
      .set('modelId', modelId)
    return this.http.get<any>(`${this.baseUrl}/trim`,
      { params: params });
  }
  getProvince(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/province`);
  }

  getCity(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/city/${id}`);
  }

  getPostedPost(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/motorPost/myPost`,
      {
        params: new HttpParams()
          .set('motorPostId', id)
      });
  }

  getPostedAllPost(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/motorPost/myPost`,
      { headers: headers });
  }

  getPostedAllProperty(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/rent/myPost`,
      { headers: headers });
  }


  deletePost(id) {
    return this.http
      .delete<any>(`${this.baseUrl}/motorPost/${id}`);
  }

  deletePropertyPost(id) {
    return this.http
      .delete<any>(`${this.baseUrl}/rent/${id}`);
  }

  getPropertyCategory(type): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/rentCategory`,
      {
        params: new HttpParams()
          .set('type', type)
      });
  }

  propertyPostLevel1(data: any) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/rent`, data,
        { headers: headers });
  }

  propertyPostLevelUpdate(data: any, id) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/rent/${id}`, data,
        { headers: headers });
  }

  getPostedPrpertyPost(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/rent/myPost`,
      {
        params: new HttpParams()
          .set('rentPostId', id)
      });
  }

  getSubscripPackage(type): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription/`,
      {
        params: new HttpParams()
          .set('type', type)
      });
  }

  getSubscripPackageAdd(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subscription`);
  }

  getUser(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/getUser`,
      { headers: headers, })
  }

  getPostUser(id): Observable<any> {
    const headers = new HttpHeaders()
      .set('userId', id)
    return this.http.get<any>(`${this.baseUrl}/getUser`,
      { headers: headers, })
  }

  getHomeDataWithoutUserId(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/home`);
  }

  getHomeDataWithUserId(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/home`,
      { headers: headers, });
  }

  motorFavouriteUnfavourite(user: any) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/motorFavourites`, user,
        { headers: headers, });
  }

  propertyFavouriteUnfavourite(user: any) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/rentFavourites`, user,
        { headers: headers, });
  }

  getMotorFavorites(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/motorFavourites/list`,
      { headers: headers });
  }

  getPropertyFavorites(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/rentFavourites/list`,
      { headers: headers });
  }

  buySubscription(user: any) {
    return this.http
      .post<any>(`${this.baseUrl}/subscriptionList`, user);
  }

  getSubscriptionList(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/subscriptionList`,
      { headers: headers });
  }

  getMotorCount(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/motorPostCount`);
  }

  getRecentMotors(): Observable<any> {
    const params = new HttpParams()
      .set('orderbyColumn', 'id')
      .set('orderbyValue', 'DESC')
    return this.http.get<any>(`${this.baseUrl}/motorPost`,
      { params: params });
  }

  getCategoryMotorPosts(id, page, size): Observable<any> {
    const params = new HttpParams()
      .set('mainMotorCategoryId', id)
      .set('offset', page)
      .set('limit', size)
    return this.http.get<any>(`${this.baseUrl}/motorPost`,
      { params: params });
  }

  getMotorPostwithPAge(page, size): Observable<any> {
    const params = new HttpParams()
      .set('offset', page)
      .set('limit', size)
    return this.http.get<any>(`${this.baseUrl}/motorPost`,
      { params: params });
  }

  getPropetyCount(type): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
    return this.http.get<any>(`${this.baseUrl}/rentPostCount`,
      { params: params });
  }

  getRecentProperty(type): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
      .set('orderbyColumn', 'id')
      .set('orderbyValue', 'DESC')
    return this.http.get<any>(`${this.baseUrl}/rent`,
      { params: params });
  }

  getCategoryPropertyPosts(id, type, page, size): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
      .set('categoryId', id)
      .set('offset', page)
      .set('limit', size)
    return this.http.get<any>(`${this.baseUrl}/rent`,
      { params: params });
  }

  getPropertyPostwithPAge(page, size): Observable<any> {
    const params = new HttpParams()
      .set('offset', page)
      .set('limit', size)
    return this.http.get<any>(`${this.baseUrl}/rent`,
      { params: params });
  }

  getMotorFilter(mainCategoryId, makeName, modelName, trimName, provinceId, cityId, priceStart, priceEnd, yearStart, yearEnd,
    kiloStart, kiloEnd, warrantyInfo, specsValue, bodyType, transmissionType, interColor, exterColor,
    cylinders, finalDrive, wheels, engineSize, subCategoryId, subSubCategId, horsePower, boatLength,
    key, order, page, limit): Observable<any> {
    const params = new HttpParams()
      .set('mainMotorCategoryId', mainCategoryId)
      .set('make', makeName)
      .set('model', modelName)
      .set('trim', trimName)
      .set('provinceId', provinceId)
      .set('cityId', cityId)
      .set('startingPrice', priceStart)
      .set('endingPrice', priceEnd)
      .set('startingYear', yearStart)
      .set('endingYear', yearEnd)
      .set('startingKilometer', kiloStart)
      .set('endingKilometer', kiloEnd)
      .set('warranty', warrantyInfo)
      .set('regionalSpecs', specsValue)
      .set('bodyType', bodyType)
      .set('transmissionType', transmissionType)
      .set('interiorColor', interColor)
      .set('exteriorColor', exterColor)
      .set('cylinders', cylinders)
      .set('finalDriveSystem', finalDrive)
      .set('wheels', wheels)
      .set('engineSize', engineSize)
      .set('motorCategoryId', subCategoryId)
      .set('motorSubCategoryId', subSubCategId)
      .set('horsePower', horsePower)
      .set('length', boatLength)
      .set('orderbyColumn', key)
      .set('orderbyValue', order)
      .set('offset', page)
      .set('limit', limit)
    return this.http.get<any>(`${this.baseUrl}/motorPost`,
      { params: params });
  }

  getPropertySort(type, key, order, categoryId): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
      .set('orderbyColumn', key)
      .set('orderbyValue', order)
      .set('categoryId', categoryId)
    return this.http.get<any>(`${this.baseUrl}/rent`,
      { params: params });
  }

  getPropProvince(type, categId, provinceId, cityId, priceStart, priceEnd, beds, propAge, areaStart, areaEnd,
    baths, rentalTerm, key, order, page, limit): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
      .set('categoryId', categId)
      .set('provinceId', provinceId)
      .set('cityId', cityId)
      .set('startingPrice', priceStart)
      .set('endingPrice', priceEnd)
      .set('noBedrooms', beds)
      .set('propertyAge', propAge)
      .set('startingAreaInSqmt', areaStart)
      .set('endAreaInSqmt', areaEnd)
      .set('noBathrooms', baths)
      .set('rentalTerm', rentalTerm)
      .set('orderbyColumn', key)
      .set('orderbyValue', order)
      .set('offset', page)
      .set('limit', limit)
    return this.http.get<any>(`${this.baseUrl}/rent`,
      { params: params });
  }

  getHomePropertyFilters(type, id, provinceId, cityId, rental, noBeds, noBaths): Observable<any> {
    const params = new HttpParams()
      .set('type', type)
      .set('categoryId', id)
      .set('provinceId', provinceId)
      .set('cityId', cityId)
      .set('rentalTerm', rental)
      .set('noBedrooms', noBeds)
      .set('noBathrooms', noBaths)
    return this.http.get<any>(`${this.baseUrl}/rent`,
      { params: params });
  }

  getHomeMotorFilter(categId, subCategoryId, subSubCategId, makeName, modelName, trimName, provinceId, cityId,
    yearStart, yearEnd): Observable<any> {
    if (makeName == 'all') {
      var makeNN = ''
    } else {
      makeNN = makeName
    }

    if (makeName == 'all') {
      var makeNN = ''
    } else {
      makeNN = makeName
    }

    if (modelName == 'all') {
      var modelNN = ''
    } else {
      modelNN = modelName
    }

    if (trimName == 'all') {
      var trimNN = ''
    } else {
      trimNN = trimName
    }

    if (provinceId == 'all') {
      var provinCeVVV = ''
    } else {
      provinCeVVV = provinceId
    }

    if (cityId == 'all') {
      var cityVV = ''
    } else {
      cityVV = cityId
    }
    const params = new HttpParams()
      .set('mainMotorCategoryId', categId)
      .set('motorCategoryId', subCategoryId)
      .set('motorSubCategoryId', subSubCategId)
      .set('make', makeNN)
      .set('model', modelNN)
      .set('trim', trimNN)
      .set('provinceId', provinCeVVV)
      .set('cityId', cityVV)
      .set('startingYear', yearStart)
      .set('endingYear', yearEnd)
    return this.http.get<any>(`${this.baseUrl}/motorPost`,
      { params: params });
  }

  recentMotorClick(data: any) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/motorViewedProduct`, data,
        { headers: headers });
  }

  recentPropClick(data: any) {
    let userId = localStorage.getItem('saudiDealsUserId');
    const headers = new HttpHeaders()
      .set('userId', userId)
    return this.http
      .post<any>(`${this.baseUrl}/rentViewedProduct`, data,
        { headers: headers });
  }

  getNotification(): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const params = new HttpParams()
      .set('userId', userId)
    return this.http.get<any>(`${this.baseUrl}/notification`,
      { params: params });
  }

  getNotificationwithPAge(page, size): Observable<any> {
    let userId = localStorage.getItem('saudiDealsUserId');
    const params = new HttpParams()
      .set('userId', userId)
      .set('offset', page)
      .set('limit', size)
    return this.http.get<any>(`${this.baseUrl}/notification`,
      { params: params });
  }

  sendContactData(data: any) {
    return this.http
      .post<any>(`${this.baseUrl}/contact`, data);
  }

  getTerms(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/url`);
  }

  profileDelete(data: any, id: any) {
    const headers = new HttpHeaders()
      .set('userId', id)
    return this.http
      .post<any>(`${this.baseUrl}/update`, data,
        { headers: headers });
  }

  clearNotification() {
    return this.http.delete<any>(`${this.baseUrl}/notification/deleteAll`);
  }

  showToast(message: any, title: any) {
    Swal.fire({
      toast: true,
      icon: message,
      title: title,
      position: 'bottom',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
  }
}