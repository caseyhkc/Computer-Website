<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



/*
--------------------------------------------------------------------------
Page Controller
--------------------------------------------------------------------------
*/

// Customer
Route::get('/', 'PageController@showShoppingCart');


// Admin
Route::group(['prefix' => 'Admin'], function()
	{
		Route::get('/', 'PageController@showLogin');
		Route::get('/ProductManager', 'PageController@showProductManager');
		Route::get('/Account', 'PageController@showAccount');
	});


Route::get('/Test', 'PageController@testGet');
Route::post('/Test', 'PageController@testPost');

/*
--------------------------------------------------------------------------
Product Controller
--------------------------------------------------------------------------
*/

//Route::resource('Admin','ProductController');

// Route::get('/Admin', function () {
//     return view('Admin.AdminInventory');
// });

Route::get('/check', 'ProductController@check');


Route::get('/Product/search', 'ProductController@search');
Route::post('/Product/AddProduct', 'ProductController@AddProduct');
Route::post('/Product/RemoveProduct', 'ProductController@RemoveProduct');
Route::post('/Product/AddType', 'ProductController@AddType');
Route::post('/Product/AddBrand', 'ProductController@AddBrand');
Route::post('/Product/DeleteBrand','ProductController@deleteBrand');

Route::get('/check', 'ProductController@check');


/*
--------------------------------------------------------------------------
Order Controller
--------------------------------------------------------------------------
*/


/*
--------------------------------------------------------------------------
Account Controller
--------------------------------------------------------------------------
*/


Route::get('Account/ShowAllData', 'AccountController@ShowAllData');
Route::get('Account/Logout', 'AccountController@Logout');
Route::post('Account/Login', 'AccountController@Login');
Route::post('Account/AddAccount', 'AccountController@AddAccount');
Route::post('Account/RemoveAccount', 'AccountController@RemoveAccount');
