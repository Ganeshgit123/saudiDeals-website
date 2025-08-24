import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "login",
    loadChildren: () => import("./login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "otp",
    loadChildren: () => import("./otp/otp.module").then((m) => m.OTPModule),
  },
  {
    path: "sign-up",
    loadChildren: () => import("./sign-up/sign-up.module").then((m) => m.SignUpModule),
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "motors",
    loadChildren: () => import("./motors/motors.module").then((m) => m.MotorsModule),
  },
  {
    path: "property",
    loadChildren: () => import("./property/property.module").then((m) => m.PropertyModule),
  },
  {
    path: "property/:type",
    loadChildren: () => import("./property/property.module").then((m) => m.PropertyModule),
  },
  {
    path: "category",
    loadChildren: () => import("./select-category/select-category.module").then((m) => m.SelectCategoryModule),
  },
  {
    path: "motor_terms",
    loadChildren: () => import("./motor-flow/motor-terms/motor-terms.module").then((m) => m.MotorTermsModule),
  },
  {
    path: "motor_terms/:categ",
    loadChildren: () => import("./motor-flow/motor-terms/motor-terms.module").then((m) => m.MotorTermsModule),
  },
  {
    path: "motor_terms/:categ/:subcateg",
    loadChildren: () => import("./motor-flow/motor-terms/motor-terms.module").then((m) => m.MotorTermsModule),
  },
  {
    path: "motor_terms/:categ/:subcateg/:subSubcateg",
    loadChildren: () => import("./motor-flow/motor-terms/motor-terms.module").then((m) => m.MotorTermsModule),
  },
  {
    path: "motor_subscription",
    loadChildren: () => import("./motor-flow/motor-subscription/motor-subscription.module").then((m) => m.MotorSubscriptionModule),
  },
  {
    path: "motor_subscription/:categ/:postId",
    loadChildren: () => import("./motor-flow/motor-subscription/motor-subscription.module").then((m) => m.MotorSubscriptionModule),
  },
  {
    path: "motor_subscription/:categ/:subcateg/:postId",
    loadChildren: () => import("./motor-flow/motor-subscription/motor-subscription.module").then((m) => m.MotorSubscriptionModule),
  },
  {
    path: "motor_subscription/:categ/:subcateg/:subSubcateg/:postId",
    loadChildren: () => import("./motor-flow/motor-subscription/motor-subscription.module").then((m) => m.MotorSubscriptionModule),
  },
  {
    path: "motor_category",
    loadChildren: () => import("./motor-flow/motor-category/motor-category.module").then((m) => m.MotorCategoryModule),
  },
  {
    path: "motor_category/:subcateg",
    loadChildren: () => import("./motor-flow/motor-category/sub-category/sub-category.module").then((m) => m.SubCategoryModule),
  },
  {
    path: "motor_category/:subcateg/:subSubcateg",
    loadChildren: () => import("./motor-flow/motor-category/sub-sub-category/sub-sub-category.module").then((m) => m.SubSubCategoryModule),
  },
  {
    path: "post-ad-motor/:categ",
    loadChildren: () => import("./motor-post-ad/motor-post-ad.module").then((m) => m.MotorPostAdModule),
  },
  {
    path: "post-ad-motor/:categ/:subcateg",
    loadChildren: () => import("./motor-post-ad/motor-post-ad.module").then((m) => m.MotorPostAdModule),
  },
  {
    path: "post-ad-motor/:categ/:subcateg/:subSubcateg",
    loadChildren: () => import("./motor-post-ad/motor-post-ad.module").then((m) => m.MotorPostAdModule),
  },
  {
    path: "ad-details/:categ/:id",
    loadChildren: () => import("./ad-details/ad-details.module").then((m) => m.AdDetailsModule),
  },
  {
    path: "my_ads",
    loadChildren: () => import("./my-ads/my-ads.module").then((m) => m.MyAdsModule),
  },
  {
    path: "main_property",
    loadChildren: () => import("./property-flow/category/category.module").then((m) => m.CategoryModule),
  },
  {
    path: "property_terms/:category/:id",
    loadChildren: () => import("./property-flow/terms-condition/terms-condition.module").then((m) => m.TermsConditionModule),
  },
  {
    path: "prop_subscription",
    loadChildren: () => import("./property-flow/prop-subscription/prop-subscription.module").then((m) => m.PropSubscriptionModule),
  },
  {
    path: "prop_subscription/:type/:categId/:postId",
    loadChildren: () => import("./property-flow/prop-subscription/prop-subscription.module").then((m) => m.PropSubscriptionModule),
  },
  {
    path: "property_category/:category",
    loadChildren: () => import("./property-flow/sub-category/sub-category.module").then((m) => m.SubCategoryModule),
  },
  {
    path: "property-post-ad/:categ/:subCateg",
    loadChildren: () => import("./property-post-ad/property-post-ad.module").then((m) => m.PropertyPostAdModule),
  },
  {
    path: "contact-us",
    loadChildren: () => import("./contact/contact.module").then((m) => m.ContactModule),
  },
  {
    path: "terms-of-use",
    loadChildren: () => import("./terms-page/terms-page.module").then((m) => m.TermsPageModule),
  },
  {
    path: "about-us",
    loadChildren: () => import("./about-us/about-us.module").then((m) => m.AboutUsModule),
  },
  {
    path: "my_favourite",
    loadChildren: () => import("./my-favourite/my-favourite.module").then((m) => m.MyFavouriteModule),
  },
  {
    path: "notifications",
    loadChildren: () => import("./notifications/notifications.module").then((m) => m.NotificationsModule),
  },
  {
    path: "motors_filter/:category",
    loadChildren: () => import("./motor-filters/motor-filters.module").then((m) => m.MotorFiltersModule),
  },
  {
    path: "property_filter/:category",
    loadChildren: () => import("./property-filters/property-filters.module").then((m) => m.PropertyFiltersModule),
  },
  {
    path: "property_filter/:category/:id",
    loadChildren: () => import("./property-filters/property-filters.module").then((m) => m.PropertyFiltersModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
