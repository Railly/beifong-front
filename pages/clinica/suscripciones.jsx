import SubscriptionCard from "components/SubscriptionCard"
import { useRouter } from "next/router"

export default function Suscripciones() {
  let token
  const router = useRouter()

  // useEffect(() => {
  //   const clinicId = window.localStorage.getItem("clinicId")

  //   const getClinic = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_BEIFONG_API_URL}/api/clinics/${clinicId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       const json = await res.json()
  //       if (json.ok) {
  //         console.log(json)
  //       } else {
  //         console.log(json)
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   if (clinicId) {
  //     getClinic()
  //   }
  // }, [])

  // useEffect(() => {
  //   const token = window.localStorage.getItem("token")
  //   if (token) {
  //     router.push("/clinica/page-builder")
  //   }
  // }, [])

  const onSubmit = async (mount, subscriptionType) => {
    if (typeof window !== "undefined") {
      token = JSON.parse(window.localStorage.getItem("token"))
    }
    const data = {
      mount,
      subscriptionType,
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BEIFONG_API_URL}/api/clinics/subscribe`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      )
      const json = res.json()
      console.log(json)
      router.push("/clinica/page-builder")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50 dark:bg-gray-800">
      <div>
        <h1 className="mt-8 text-3xl font-semibold text-center">
          Nuestras suscripciones
        </h1>
      </div>
      <main className="flex justify-center flex-1 w-full font-semibold bg-sky-50 dark:bg-gray-800">
        <section className="grid w-full grid-cols-1 mx-8 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
          <SubscriptionCard
            type="Mensual"
            price="S/. 179"
            features={[
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor sit amet",
            ]}
            handleSubmit={() => onSubmit("179.00", "monthly")}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          </SubscriptionCard>
          <SubscriptionCard
            type="Anual"
            price="S/. 399"
            features={[
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor sit amet",
            ]}
            handleSubmit={() => onSubmit("399.00", "annual")}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          </SubscriptionCard>
          <SubscriptionCard
            type="Semestral"
            price="S/. 249"
            features={[
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor sit amet",
            ]}
            handleSubmit={() => onSubmit("249.00", "semi-annual")}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          </SubscriptionCard>
        </section>
      </main>
    </div>
  )
}