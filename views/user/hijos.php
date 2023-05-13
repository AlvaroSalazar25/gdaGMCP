        <div class="alert  px-5 py-2 mt-3 w-100 ">
            <div class="d-flex justify-content-center align-items-center">
                <h4 class="" style="color:red">No Existen Carpetas</h4>
            </div>
        </div>
        <div class="d-flex justify-content-center " style="flex-wrap:wrap">
            <div class="p-3 padreCarpeta">
                <a class="btn hoverCarpeta" style="border:1px solid #e2e4e6" onclick="dibujarPadreAndCarpetas(' + hijo.id + ')">
                    <div class="row justify-content-center align-items-center  widthCarpeta ">
                        <div class="">
                            <i class="fa-regular fa-folder-open" style="font-size:40px;margin-bottom:10px;color:' + hijo.color + '"></i>
                            <div style="margin-bottom:-7px">
                                <p style="font-weight:bold">' + (hijo.seccion[0].toUpperCase() + hijo.seccion.substring(1)) + '</p>
                            </div>
                        </div>
                    </div>
                </a>
                <div class="d-flex justify-content-center align-items-center elip">
                    <buttom class="btn btn-outline-secondary botonesCarpeta btn-hover dropdown-toggle py-2 px-3" style="border:none" data-bs-toggle="dropdown" aria-expanded="false" type="buttom">
                        <i class="fa-solid fa-ellipsis-vertical fa-xl elip"></i>
                    </buttom>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li class="puntero"><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal' + hijo.id + '"><i class="fa-solid fa-pen-to-square" style="margin-right:7px"></i>Editar</a></li>
                        <li class="puntero"><a class="dropdown-item" onclick="deleteSeccion(' + hijo.id + ')"><i class="fa-solid fa-trash" style="margin-right:7px"></i>Eliminar</a></li>
                    </ul>
                </div>
            </div>
            <!--=============================================================================================================//
                                                        Modal para cada hijo
            //============================================================================================================== -->
            <div class="modal fade" id="exampleModal' + hijo.id + '" tabindex="-1" aria-labelledby="exampleModalLabel' + hijo.id + '" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-black">
                            <h5 class="modal-title text-white">Editar</h5>
                            <button type="button" class="btn text-white" style="font-size:11px" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-x fa-lg"></i></button>
                        </div>
                        <div class="modal-body" style="min-height:350px">
                            <h3 class="text-black mt-2 mb-4">Edite <strong>' + hijo.seccion + '</strong></h3>

                            <div class="mb-4 d-flex justify-content-between">

                                <div class="d-flex flex-column" style="width:70%">
                                    <label class="form-label"><strong>Nombre:</strong></label>
                                    <input type="text" class="form-control" id="seccion' + hijo.id + '" value="' + hijo.seccion + '">
                                </div>

                                <div class="d-flex flex-column" style="width:28%">
                                    <label class="form-label"><strong>Color:</strong></label>
                                    <input type="color" class="form-control  puntero" id="color' + hijo.id + '" value="' + hijo.color + '">
                                </div>
                            </div>
                            <div class="mb-4">
                                <label for="exampleFormControlInput1" class="form-label"><strong>Descripción:</strong></label>
                                <textarea class="form-control" rows="6" id="descripcion' + hijo.id + '" placeholder="Esta Sección no tiene descripción"></textarea>
                                <textarea class="form-control" rows="6" id="descripcion' + hijo.id + '">descripcion</textarea>
                            </div>

                            <div class="mb-4">
                                <div class="w-100">
                                    <label class="form-label"><strong>Mover Carpeta:</strong></label>
                                </div>

                                <div style="height:30px">
                                    <select style="width:100%;height:100% !important" id="select' + hijo.id + '" class="js-example-basic-single">

                                        <optgroup label="' + seccion.seccion + '">
                                            <option value=""><strong><i class="fa-solid fa-folder-open"></i></strong>' + seccion.path + '</option>
                    </optgroup>

            </select>
            </div>

            <div class="w-100 mt-4" id="alertas' + hijo.id + '">
            </div>

            </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
            <a class="btn btn-success" id="botonCrear" onclick="updateSeccion(' + padre + ',' + hijo.id + ',2)"><i class="fa-solid fa-floppy-disk"></i> <span style="margin-left:8px">Guardar</span></a>
            </div>
             </div>
            </div>
            </div>
        
        </div>