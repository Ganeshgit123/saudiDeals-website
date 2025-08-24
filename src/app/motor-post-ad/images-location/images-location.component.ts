import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallService } from 'src/app/services/api-call.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from 'ngx-spinner';
declare const google: any;
@Component({
  selector: 'app-images-location',
  templateUrl: './images-location.component.html',
  styleUrls: ['./images-location.component.css'],
  standalone: false
})
export class ImagesLocationComponent {
  subSubCategArray: any = [];
  params: any;
  subParams: any;
  cateeName: any;
  subCateeName: any;
  subSubParams: any;
  subSubcateeName: any;
  provinceList = [];
  cityList = [];
  locationImageForm: FormGroup;
  submitted = false;
  provinceId: any;
  updateStatusLevel = 1;
  previews = [];
  map: any;
  marker: any;
  getPostedData: any;
  imgs3 = [];
  uploadFiles = [];
  imageNeed = false;
  newUploadImg = [];
  pushedImage = [];
  isEdit = false;
  idParams: any;
  dir: any;
  imageLimt = false;
  preLength: any;
  cityClickedName: any;
  latitude: any;
  longitude: any;
  cityId: number;
  currentLat: any;
  currentLng: any;

  constructor(private router: Router, private route: ActivatedRoute, public authService: ApiCallService,
    private toastr: ToastrService, public fb: FormBuilder, private spinner: NgxSpinnerService) {
    this.locationImageForm = this.fb.group({
      provinceId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 23.8859, lng: 45.0792 },
      zoom: 5,
      gestureHandling: 'greedy', // Enable gesture handling
    });
    this.dir = sessionStorage.getItem('dir') || 'rtl';
    this.spinner.hide();

    this.route.params.subscribe((params) => {
      this.params = params['categ'];
      this.subParams = params['subcateg'];
      this.subSubParams = params['subSubcateg'];
      this.idParams = params['id'];
    });

    this.authService.getMotorCategory().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.params == element.id) {
            if (this.dir == 'ltr') {
              this.cateeName = element.name;
            } else if (this.dir == 'rtl') {
              this.cateeName = element.arName;
            }
          }
        });
      })

    this.authService.getMotorSubCateg(this.params).subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (this.subParams == element.id) {
            if (this.dir == 'ltr') {
              this.subCateeName = element.motorCategoriesName;
            } else if (this.dir == 'rtl') {
              this.subCateeName = element.arMotorCategoriesName;
            }
          }
        });
      })

    this.authService.getMotorSubSubCateg(this.subParams).subscribe(
      (res: any) => {
        this.subSubCategArray = res.data;
        res.data.forEach((element: any) => {
          if (this.subSubParams == element.id) {
            if (this.dir == 'ltr') {
              this.subSubcateeName = element.motorSubCategoriesName;
            } else if (this.dir == 'rtl') {
              this.subSubcateeName = element.arMotorSubCategoriesName;
            }
          }
        });
      })

    this.authService.getProvince().subscribe(
      (res: any) => {
        this.provinceList = res.data;
      })

    if (this.idParams != undefined) {
      this.authService.getPostedPost(this.idParams).subscribe(
        (res: any) => {
          this.getPostedData = res.data[0];
          // console.log("fe",this.previews)
          this.latitude = this.getPostedData?.latitude;
          this.longitude = this.getPostedData?.longitude;
          const geocoder = new google.maps.Geocoder();
          const latlng = {
            lat: Number(this.latitude),
            lng: Number(this.longitude)
          };
          geocoder.geocode({ 'location': latlng }, (results, status) => {
            if (status === 'OK') {
              const postion = results[0].geometry.location;
              this.map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: postion.lat(), lng: postion.lng() },
                zoom: 10,
                gestureHandling: 'greedy', // Enable gesture handling
              });
              google.maps.event.addListener(this.map, 'click', (event: any) => {
                this.placeMarker(event.latLng);
              });
              this.marker = new google.maps.Marker({
                map: this.map,
                position: results[0].geometry.location,
              });
            }
          });
          // this.preLength = this.previews.length;
          if (this.getPostedData.image == null) {
            this.previews = [];
            this.isEdit = false;
          } else {
            this.isEdit = true;
            this.previews = this.getPostedData.image.sort(function (first, second) {
              return first.order - second.order;
            });
            this.locationImageForm = this.fb.group({
              provinceId: [this.getPostedData.provinceId, Validators.required],
              cityId: [this.getPostedData.cityId, Validators.required],
              latitude: [this.getPostedData.latitude],
              longitude: [this.getPostedData.longitude],
              image: '',
            });
            const geocoder = new google.maps.Geocoder();
            const latlng = {
              lat: Number(this.getPostedData.latitude),
              lng: Number(this.getPostedData.longitude)
            };
            geocoder.geocode({ 'location': latlng }, (results, status) => {
              if (status === 'OK') {
                const postion = results[0].geometry.location;
                this.map = new google.maps.Map(document.getElementById('map'), {
                  center: { lat: postion.lat(), lng: postion.lng() },
                  zoom: 10,
                  gestureHandling: 'greedy', // Enable gesture handling
                });
                google.maps.event.addListener(this.map, 'click', (event: any) => {
                  this.placeMarker(event.latLng);
                });
                this.marker = new google.maps.Marker({
                  map: this.map,
                  position: results[0].geometry.location,
                });
              }
            });
          };
          this.authService.getCity(this.getPostedData.provinceId).subscribe(
            (res: any) => {
              this.cityList = res.data;
              sessionStorage.setItem("cityList", JSON.stringify(this.cityList))
            });
        });
    }
  }
  get locationf() { return this.locationImageForm.controls; }

  getPosition() {
    if (navigator.geolocation) {
      const geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 10000, // Increase timeout
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log('Full position object:', position);
          // console.log('Accuracy (meters):', position.coords.accuracy);

          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;

          const geocoder = new google.maps.Geocoder();
          const latlng = {
            lat: this.currentLat,
            lng: this.currentLng
          };

          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;

              this.map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: location.lat(), lng: location.lng() },
                zoom: 15,
                gestureHandling: 'greedy',
              });

              this.marker = new google.maps.Marker({
                map: this.map,
                position: location,
              });

              google.maps.event.addListener(this.map, 'click', (event: any) => {
                this.placeMarker(event.latLng);
              });
            } else {
              console.error('Geocoder failed due to:', status);
            }
          });
        },
        (error) => {
          console.error('Geolocation error:', error.message);
        },
        geolocationOptions
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onModelChange(value) {
    this.provinceId = value;
    sessionStorage.setItem('provinceId', this.provinceId)
    let provinceFiltList = this.provinceList.filter(val => {
      return val.id === value;
    })
    let provinceName = provinceFiltList[0].name;
    if (provinceName == 'Eastern Province') {
      provinceName = 'Eastern Province Saudi Arabia'
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': provinceName }, (results, status) => {
      if (status === 'OK') {
        const postion = results[0].geometry.location;
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: postion.lat(), lng: postion.lng() },
          zoom: 8,
          gestureHandling: 'greedy', // Enable gesture handling
        });
        // const marker = new google.maps.Marker({
        //   map: this.map,
        //   position: results[0].geometry.location,
        // });
      }
    });
    this.authService.getCity(this.provinceId).subscribe(
      (res: any) => {
        this.cityList = res.data;
        sessionStorage.setItem("cityList", JSON.stringify(this.cityList))
      });
  }


  cityName(value) {
    this.cityId = value;
    var fullcity = JSON.parse(sessionStorage.getItem('cityList'));
    let cityFiltList = fullcity.filter(val => {
      return val.id === value;
    })
    let cityName = cityFiltList[0].city;
    if (cityName == 'Turbah') {
      cityName = 'Turabah'
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': cityName }, (results, status) => {
      if (status === 'OK') {
        const postion = results[0].geometry.location;
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: postion.lat(), lng: postion.lng() },
          zoom: 15,
          gestureHandling: 'greedy', // Enable gesture handling
        });
        google.maps.event.addListener(this.map, 'click', (event: any) => {
          this.placeMarker(event.latLng);
        });
      }
    });
  }

  placeMarker(location: any): void {
    if (this.marker) {
      this.marker.setMap(null); // Remove existing marker
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
    this.map.panTo(location); // Pan the map to the clicked location

    this.showLatLng(location); // Optionally display coordinates
  }

  showLatLng(location: any): void {
    this.latitude = location.lat();
    this.longitude = location.lng();
  }

  changeProductImages(event: any) {
    this.imageNeed = false;
    if (event.target.files && event.target.files[0]) {
      const numberOfNewFiles = event.target.files.length;
      const currentImageCount = this.previews.length;

      if (currentImageCount + numberOfNewFiles <= 8) {
        this.imageLimt = false;

        const watermarkSrc = '../assets/images/watermark.png'; // Preload the watermark image once

        const files: File[] = Array.from(event.target.files as FileList);
        // Array to hold processed images for maintaining the order
        const processedImages: Promise<void>[] = [];

        const processImage = async (file: File, index: number, watermarkSrc: string) => {
          const imageDataUrl = await this.readFileAsDataURL(file);
          const uploadedImage = await this.loadImage(imageDataUrl);
          const watermarkedDataUrl = await this.applyWatermark(uploadedImage, watermarkSrc);

          // Calculate the actual index to place the image in the arrays
          const targetIndex = currentImageCount + index;
          this.previews[targetIndex] = watermarkedDataUrl;
          this.pushedImage[targetIndex] = watermarkedDataUrl;

          const watermarkedBlob = await this.dataURLToBlob(watermarkedDataUrl);
          const watermarkedFile = new File([watermarkedBlob], file.name, { type: 'image/png', lastModified: new Date().getTime() });

          this.uploadFiles[targetIndex] = { file: watermarkedFile, order: targetIndex + 1 };
        };

        // Process each image and store the promise in processedImages
        files.forEach((file, index) => {
          processedImages.push(processImage(file, index, watermarkSrc));
        });

        Promise.all(processedImages)
          .then(() => {
            // All images processed in order
            // console.log('All images processed in order');
            // console.log('Previews:', this.previews);
            // console.log('Upload Files:', this.uploadFiles);
          })
          .catch(error => {
            console.error('Error processing images', error);
          });
      } else {
        this.imageLimt = true;
        this.toastr.error('Error', 'Max 8 images are allowed');
      }
    }
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async applyWatermark(uploadedImage: HTMLImageElement, watermarkSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject('Canvas is not supported');
      }

      canvas.width = uploadedImage.width;
      canvas.height = uploadedImage.height;

      // Draw the original uploaded image
      ctx.drawImage(uploadedImage, 0, 0, uploadedImage.width, uploadedImage.height);

      const watermarkImage = new Image();
      watermarkImage.src = watermarkSrc;

      watermarkImage.onload = () => {
        // Resize and position the watermark
        const scale = 0.6; // scale factor of the watermark relative to base image
        const watermarkWidth = uploadedImage.width * scale;
        const watermarkHeight = watermarkImage.height * (watermarkWidth / watermarkImage.width);

        const x = (uploadedImage.width - watermarkWidth) / 2;
        const y = (uploadedImage.height - watermarkHeight) / 2;
        // Draw watermark over the image
        ctx.globalAlpha = 0.5 // Optional: make watermark semi-transparent
        ctx.drawImage(watermarkImage, x, y, watermarkWidth, watermarkHeight);

        // Get the final image
        resolve(canvas.toDataURL('image/png'));
      };


      watermarkImage.onerror = () => reject('Failed to load watermark image');
    });
  }


  dataURLToBlob(dataURL: string): Promise<Blob> {
    return fetch(dataURL).then(res => res.blob());
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.previews, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        this.previews,
        event.previousIndex,
        event.currentIndex,
      );
    }
    // moveItemInArray(this.previews, event.previousIndex, event.currentIndex);
  }

  removeImage(i: any) {
    this.previews.splice(i, 1);
    this.uploadFiles.splice(i, 1);
  }


  postproduct() {
    this.submitted = true;
    if (this.previews == null || this.previews.length <= 1) {
      this.imageNeed = true;
      return;
    }
    if (this.locationImageForm.invalid) {
      return;
    }
    this.spinner.show();
    if (this.isEdit) {
      this.editproduct()
      return;
    }
    if (this.uploadFiles && this.uploadFiles.length > 0) {
      // Filter out invalid or empty values
      this.uploadFiles = this.uploadFiles.filter(file => file && file.file);
      // If there are valid files left, proceed with the upload
      if (this.uploadFiles.length > 0) {
        var imgLength = this.uploadFiles.length;

        for (let i = 0; i < this.uploadFiles.length; i++) {
          var postData = new FormData();
          postData.append('image', this.uploadFiles[i].file);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.success == true) {
              // var uploadedImg = res.files[0].url;
              const object = {
                url: res.files[0].url,
                order: this.uploadFiles[i].order
              }
              this.imgs3.push(object);
              this.previews.push(object);
              // console.log("imgs3",this.imgs3)
              // console.log("previews",this.previews)
              if (0 === --imgLength) {
                this.locationImageForm.value.image = JSON.stringify(this.imgs3);
                this.onSubmitLocationImage(this.locationImageForm.value);
              }
            }
          })
        }
      }
    } else {
      this.onSubmitLocationImage(this.locationImageForm.value);
    }
  }

  onSubmitLocationImage(value) {
    this.submitted = false;
    this.locationImageForm.value.provinceId = this.provinceId;
    this.locationImageForm.value.cityId = this.cityId;
    this.locationImageForm.value.updateStatusLevel = this.updateStatusLevel;
    this.locationImageForm.value.image = JSON.stringify(this.imgs3);
    if (!(this.currentLat && this.currentLng)) {
      this.locationImageForm.value.latitude = String(this.latitude ? this.latitude : '');
      this.locationImageForm.value.longitude = String(this.longitude ? this.longitude : '');
    } else {
      this.locationImageForm.value.latitude = String(this.currentLat);
      this.locationImageForm.value.longitude = String(this.currentLng);
    }
    const postId = sessionStorage.getItem('postId');
    // console.log("Subm",this.locationImageForm.value)
    this.authService.motorPostLevelUpdate(this.locationImageForm.value, postId)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.spinner.hide();
          this.submitted = false;
          this.toastr.success('Success', res.massage);
          if (this.subParams != undefined && this.subSubParams == undefined) {
            this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/specifications/${postId}`]);
          } else if (this.subParams != undefined && this.subSubParams != undefined) {
            this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/specifications/${postId}`]);
          } else {
            this.router.navigate([`/post-ad-motor/${this.params}/specifications/${postId}`]);
          }
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }
  prePost() {
    if (this.subParams != undefined && this.subSubParams == undefined) {
      this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/description/${this.idParams}`]);
    } else if (this.subParams != undefined && this.subSubParams != undefined) {
      this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/description/${this.idParams}`]);
    } else {
      this.router.navigate([`/post-ad-motor/${this.params}/description/${this.idParams}`]);
    }
  }

  editproduct() {
    this.spinner.show();
    if (this.uploadFiles && this.uploadFiles.length > 0) {
      // Filter out invalid or empty values
      this.uploadFiles = this.uploadFiles.filter(file => file && file.file);
      // If there are valid files left, proceed with the upload
      if (this.uploadFiles.length > 0) {
        var imgLength = this.uploadFiles.length;
        for (let i = 0; i < this.uploadFiles.length; i++) {
          var postData = new FormData();
          postData.append('image', this.uploadFiles[i].file);
          this.authService.s3upload(postData).subscribe((res: any) => {
            if (res.success == true) {
              const object = {
                url: res.files[0].url,
                order: this.uploadFiles[i].order
              }
              this.newUploadImg.push(object);
              // console.log("Ffe",this.newUploadImg)
              this.previews = this.previews.filter(val => !this.pushedImage.includes(val));
              // console.log("edit",this.previews)
              if (0 === --imgLength) {
                var merge = this.previews.concat(this.newUploadImg)
                this.locationImageForm.value.image = JSON.stringify(merge);
                this.locationImageForm.value.provinceId = this.provinceId;
                this.locationImageForm.value.updateStatusLevel = this.updateStatusLevel;
                if (!(this.currentLat && this.currentLng)) {
                  this.locationImageForm.value.latitude = String(this.latitude ? this.latitude : '');
                  this.locationImageForm.value.longitude = String(this.longitude ? this.longitude : '');
                } else {
                  this.locationImageForm.value.latitude = String(this.currentLat);
                  this.locationImageForm.value.longitude = String(this.currentLng);
                }
                this.editProductImage(this.locationImageForm.value);
              }
            }
          })
        }
      }
    } else {
      this.locationImageForm.value.image = JSON.stringify(this.previews);
      this.locationImageForm.value.provinceId = this.provinceId;
      this.locationImageForm.value.updateStatusLevel = this.updateStatusLevel;
      if (!(this.currentLat && this.currentLng)) {
        this.locationImageForm.value.latitude = String(this.latitude ? this.latitude : '');
        this.locationImageForm.value.longitude = String(this.longitude ? this.longitude : '');
      } else {
        this.locationImageForm.value.latitude = String(this.currentLat);
        this.locationImageForm.value.longitude = String(this.currentLng);
      }
      this.editProductImage(this.locationImageForm.value);
    }
  }

  editProductImage(data) {
    this.submitted = false;
    this.authService.motorPostLevelUpdate(data, this.idParams)
      .subscribe((res: any) => {
        if (res.success == true) {
          this.toastr.success('Success', res.massage);
          if (this.subParams != undefined && this.subSubParams == undefined) {
            this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/specifications/${this.idParams}`]);
          } else if (this.subParams != undefined && this.subSubParams != undefined) {
            this.router.navigate([`/post-ad-motor/${this.params}/${this.subParams}/${this.subSubParams}/specifications/${this.idParams}`]);
          } else {
            this.router.navigate([`/post-ad-motor/${this.params}/specifications/${this.idParams}`]);
          }
        } else {
          this.toastr.error('Error', res.massage);
        }
      })
  }
}
