import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup/dist/yup"
import Button from "ui/Button"
import Logo from "ui/Logo"
import * as yup from "yup"
import Image from "next/image"
import FileInput from "ui/FileInput"
import SelectInput from "ui/SelectInput"
import RadioGroup from "ui/RadioGroup"
import TextareaInput from "ui/TextareaInput"
import TextInput from "ui/TextInput"
import { daysToSpanish } from "utils/constants"

const schema = yup.object().shape({
  slogan: yup.string().required("El slogan es requerido").min(15),
  subslogan: yup.string().required("El subslogan es requerido").min(25),
  startAttentionDay: yup.string().required("El día inicial es requerido"),
  endAttentionDay: yup.string().required("El día final es requerido"),
  initial_hour: yup.string().required("La hora inicial es requerida"),
  initial_minute: yup.string().required("El minuto inicial es requerido"),
  final_hour: yup.string().required("La hora final es requerida"),
  final_minute: yup.string().required("El minuto final es requerido"),
  img: yup.mixed().required("El logo es requerido"),
  seccion: yup.array().of(
    yup.object().shape({
      imgPosition: yup
        .string()
        .required("La posición de la imagen es requerida"),
      title: yup.string().required("El título es requerido"),
      img: yup.mixed().required("La imagen es requerida"),
      description: yup.string().required("La descripción es requerida"),
    })
  ),
})

export default function PageBuilder() {
  const [showSideBar, setShowSideBar] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "seccion",
  })

  const addSection = () => {
    append({
      imgPosition: "left",
      title: "",
      img: "",
      description: "",
    })
  }

  const removeSection = () => {
    remove(fields.length - 1)
  }

  const slogan = watch("slogan")
  const subslogan = watch("subslogan")
  const startAttentionDay = watch("startAttentionDay")
  const endAttentionDay = watch("endAttentionDay")
  const initialHour = watch("initial_hour")
  const initialMinute = watch("initial_minute")
  const finalHour = watch("final_hour")
  const finalMinute = watch("final_minute")
  const img = watch("img")
  const seccion = watch("seccion")

  console.log(errors, "errors")

  const onSubmit = (data) => {
    const token = JSON.parse(window.localStorage.getItem("token"))

    const formDataArray = data.seccion.map((section) => {
      const formData = new FormData()
      formData.append("imgPosition", section.imgPosition)
      formData.append("title", section.title)
      formData.append("description", section.description)
      formData.append("img", section.img[0])
      return formData
    })

    const updateClinicInfo = async () => {
      const newFormdata = new FormData()

      newFormdata.append("slogan", data.slogan)
      newFormdata.append("subslogan", data.subslogan)
      newFormdata.append("startAttentionDay", data.startAttentionDay)
      newFormdata.append("endAttentionDay", data.endAttentionDay)
      newFormdata.append(
        "startAttentionTime",
        `${data.initial_hour}:${data.initial_minute}`
      )
      newFormdata.append(
        "endAttentionTime",
        `${data.final_hour}:${data.final_minute}`
      )
      newFormdata.append("img", data.img[0])

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BEIFONG_API_URL}/api/clinics/information`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: newFormdata,
          }
        )
        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    }

    const updateSection = (formData) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BEIFONG_API_URL}/api/clinics/section`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
        })
    }

    updateClinicInfo()
    Promise.all(formDataArray.map(updateSection)).then(() => {
      console.log("Secciones actualizadas")
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col bg-sky-50 dark:bg-gray-800"
    >
      <div className="fixed z-10 bg-white rounded-lg bottom-28 right-10 w-max dark:bg-gray-800">
        <Button variant="tertiary">Guardar Datos</Button>
      </div>
      <div className="absolute flex w-full min-h-screen bg-sky-50 dark:bg-gray-800">
        {showSideBar && (
          <aside className="w-1/4 min-h-screen bg-sky-50 dark:bg-gray-800"></aside>
        )}
        <div className="flex flex-col flex-1 min-h-screen transition-all duration-300 bg-sky-50 dark:bg-gray-800">
          <main className="flex flex-col text-slate-700 dark:text-white">
            <section className="h-screen px-4">
              <header className="flex items-center justify-between h-48">
                {img?.length > 0 && (
                  <figure className="relative w-1/4 h-full ml-10">
                    <Image
                      src={URL.createObjectURL(img[0])}
                      alt="logo"
                      layout="fill"
                      objectFit="contain"
                    />
                  </figure>
                )}
              </header>
              <div className="grid grid-cols-2 place-items-center">
                <article className="flex flex-col items-center max-w-prose">
                  <span className="mb-6 text-5xl font-bold">{slogan}</span>
                  <span className="my-6 text-xl font-semibold">
                    {subslogan}
                  </span>
                  <Button className="w-2/4 mt-6" variant="tertiary">
                    Realizar consulta
                  </Button>
                </article>
                <article className="px-16 py-10 bg-white rounded-lg shadow-lg dark:bg-sky-100">
                  <div className="flex flex-col items-center dark:text-slate-700">
                    <p className="mb-6 text-2xl font-semibold">
                      <span className="material-icons">schedule</span>
                      <span className="ml-2 font-bold uppercase">
                        Horario de atención
                      </span>
                    </p>
                    <p className="flex justify-between w-full mb-6 text-xl font-semibold">
                      <span className="font-semibold text-gray-400 dark:text-gray-500">
                        Días
                      </span>
                      <span className="ml-2">
                        {daysToSpanish[startAttentionDay]} a{" "}
                        {daysToSpanish[endAttentionDay]}
                      </span>
                    </p>
                    <p className="flex justify-between w-full mb-6 text-xl font-semibold">
                      <span className="font-semibold text-gray-400 dark:text-gray-500">
                        Horario
                      </span>
                      <span className="ml-2">
                        {initialHour}:{initialMinute} a {finalHour}:
                        {finalMinute}
                      </span>
                    </p>
                    <p className="flex justify-between w-full mb-6 text-xl font-semibold">
                      <span className="font-semibold text-gray-400 dark:text-gray-500">
                        Teléfono
                      </span>
                      <span className="ml-2">+51 999 999 999</span>
                    </p>
                    <Button className="w-2/4 mt-4" variant="secondary">
                      Contacto
                    </Button>
                  </div>
                </article>
              </div>
            </section>
            {fields.map((field, index) => {
              return (
                <section
                  key={field.id}
                  className={`flex items-center h-screen px-10 justify-evenly ${
                    index % 2 === 0
                      ? "bg-sky-300 dark:bg-sky-800"
                      : "bg-sky-50 dark:bg-gray-800"
                  } ${
                    seccion[index].imgPosition === "right"
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  {seccion?.[index]?.img?.length > 0 && (
                    <figure className="relative w-5/12 h-full">
                      <Image
                        src={URL.createObjectURL(seccion?.[index]?.img?.[0])}
                        alt="logo"
                        layout="fill"
                        objectFit="contain"
                      />
                    </figure>
                  )}
                  <p
                    className={`flex flex-col items-center px-10 py-8 rounded-lg max-w-prose ${
                      index % 2 === 0
                        ? "bg-sky-300 dark:bg-gray-800"
                        : "bg-sky-200 dark:bg-sky-100 text-slate-700"
                    }`}
                  >
                    <span className="mb-6 text-xl font-semibold">
                      <p className="flex items-center justify-center mb-10 text-2xl font-semibold">
                        <span className="ml-2 text-4xl font-bold text-center uppercase">
                          {seccion[index].title}
                        </span>
                      </p>
                      <span className="ml-2">{seccion[index].description}</span>
                    </span>
                  </p>
                </section>
              )
            })}
            {showSideBar && (
              <div className="flex flex-col items-center justify-center pr-60 py-14 md:flex-row">
                <Button
                  className="mb-4 h-max md:w-auto md:mr-8 md:mb-0"
                  type="button"
                  variant="secondary"
                  onClick={addSection}
                  disabled={fields.length > 7}
                >
                  Agregar +
                </Button>
                <Button
                  className="mb-4 h-max md:w-auto md:mr-8 md:mb-0"
                  type="button"
                  variant="danger"
                  onClick={removeSection}
                  disabled={fields.length === 1}
                >
                  Quitar -
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      <aside
        className={`w-1/4 min-h-screen dark:bg-gray-700 bg-gray-100 transition-all duration-300 ease-in-out shadow-lg shadow-black/20 rounded-lg
        ${showSideBar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <section>
          <div className="h-screen border-b border-gray-700">
            <div className="flex flex-col items-center justify-center">
              <Logo />
            </div>
            <div className="grid w-full gap-3 px-3">
              <div>
                <span className="mb-4 font-semibold text-gray-400">
                  Sección 1
                </span>
                <FileInput
                  errors={errors.img}
                  register={register}
                  label="Logo"
                  name="img"
                  fileWatch={img}
                />
                <TextareaInput
                  className="mt-4"
                  label="Eslogan"
                  name="slogan"
                  register={register}
                  error={errors.slogan}
                  size="sm"
                />
              </div>
              <TextareaInput
                label="Subeslogan"
                name="subslogan"
                register={register}
                error={errors.subslogan}
                size="md"
              />
              <label className="flex items-center px-3 py-2 text-xs font-bold text-gray-700 uppercase select-none dark:text-gray-100">
                Días de atención
              </label>
              <div className="flex items-center">
                <SelectInput
                  name="startAttentionDay"
                  options={[
                    { value: "Monday", label: "Lunes" },
                    { value: "Tuesday", label: "Martes" },
                    { value: "Wednesday", label: "Miércoles" },
                    { value: "Thursday", label: "Jueves" },
                    { value: "Friday", label: "Viernes" },
                    { value: "Saturday", label: "Sábado" },
                    { value: "Sunday", label: "Domingo" },
                  ]}
                  {...register("startAttentionDay")}
                  noLabel
                />
                <span className="mx-2">a</span>
                <SelectInput
                  name="endAttentionDay"
                  options={[
                    { value: "Monday", label: "Lunes" },
                    { value: "Tuesday", label: "Martes" },
                    { value: "Wednesday", label: "Miércoles" },
                    { value: "Thursday", label: "Jueves" },
                    { value: "Friday", label: "Viernes" },
                    { value: "Saturday", label: "Sábado" },
                    { value: "Sunday", label: "Domingo" },
                  ]}
                  {...register("endAttentionDay")}
                  noLabel
                />
              </div>
              <div className="mt-3">
                <label className="flex items-center px-3 py-2 text-xs font-bold text-gray-700 uppercase select-none dark:text-gray-100">
                  Horario de atención
                </label>
                <div className="flex items-center">
                  <SelectInput
                    name="initial_hour"
                    placeholder="HH"
                    options={Array.from(Array(24).keys()).map((hour) => ({
                      value: hour.toString().padStart(2, "0"),
                      label: hour.toString().padStart(2, "0"),
                    }))}
                    {...register("initial_hour")}
                    noLabel
                  />
                  <span className="mx-2">:</span>
                  <SelectInput
                    name="initial_minute"
                    placeholder="MM"
                    options={Array.from(Array(60).keys()).map((minute) => ({
                      value: minute.toString().padStart(2, "0"),
                      label: minute.toString().padStart(2, "0"),
                    }))}
                    {...register("initial_minute")}
                    noLabel
                  />
                  <span className="mx-2">a</span>
                  <SelectInput
                    name="final_hour"
                    placeholder="HH"
                    options={Array.from(Array(24).keys()).map((hour) => ({
                      value: hour.toString().padStart(2, "0"),
                      label: hour.toString().padStart(2, "0"),
                    }))}
                    {...register("final_hour")}
                    noLabel
                  />
                  <span className="mx-2">:</span>
                  <SelectInput
                    name="final_minute"
                    placeholder="MM"
                    options={Array.from(Array(60).keys()).map((minute) => ({
                      value: minute.toString().padStart(2, "0"),
                      label: minute.toString().padStart(2, "0"),
                    }))}
                    {...register("final_minute")}
                    noLabel
                  />
                </div>
              </div>
            </div>
          </div>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="h-screen border-b border-gray-700">
                <div className="grid w-full gap-5 px-3 pt-6">
                  <div>
                    <span className="mb-6 ml-3 font-semibold text-gray-400">
                      {"Sección " + (index + 2)}
                    </span>
                    <TextInput
                      label={`Título ${index + 2}`}
                      name={`seccion.${index}.title`}
                      placeholder="Título"
                      register={register}
                      errors={
                        errors?.seccion?.length >= index + 1 &&
                        errors?.seccion[index]?.title
                      }
                      size="sm"
                    />
                    <FileInput
                      errors={
                        errors?.seccion?.length >= index + 1 &&
                        errors?.seccion[index]?.img
                      }
                      register={register}
                      label={`Imagen ${index + 2}`}
                      name={`seccion.${index}.img`}
                      fileWatch={seccion[index]?.img}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="flex items-center px-3 py-2 text-xs font-bold text-gray-700 uppercase select-none dark:text-gray-100">
                      {`Ubicación de la imagen ${index + 2}`}
                    </label>
                    <RadioGroup
                      options={[
                        { value: "left", name: "Izquierda" },
                        { value: "right", name: "Derecha" },
                      ]}
                      setValue={(value) =>
                        setValue(`seccion.${index}.imgPosition`, value)
                      }
                    />
                  </div>
                  <TextareaInput
                    label={`Descripción ${index + 2}`}
                    name={`seccion.${index}.description`}
                    register={register}
                    error={
                      errors?.seccion?.length >= index + 1 &&
                      errors?.seccion[index]?.description
                    }
                  />
                </div>
              </div>
            )
          })}
        </section>
      </aside>
      <Button
        className="fixed top-0 right-0 mt-4 mr-4"
        onClick={() => setShowSideBar(!showSideBar)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>
    </form>
  )
}
