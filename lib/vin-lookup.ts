// VIN Lookup utility using NHTSA API
// https://vpic.nhtsa.dot.gov/api/

export interface VINData {
  make: string
  model: string
  year: string
  bodyType: string
  engine: string
  transmission: string
  fuelType: string
  drivetrain: string
  cabSize?: string
  doors?: number
  trim?: string
  series?: string
  error?: string
}

export async function lookupVIN(vin: string): Promise<VINData | null> {
  try {
    // Clean VIN (remove spaces, convert to uppercase)
    const cleanVIN = vin.replace(/\s/g, '').toUpperCase()
    
    if (cleanVIN.length !== 17) {
              return {
          make: '',
          model: '',
          year: '',
          bodyType: '',
          engine: '',
          transmission: '',
          fuelType: '',
          drivetrain: '',
          cabSize: '',
          error: 'VIN must be exactly 17 characters'
        }
    }

    // Call NHTSA API
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${cleanVIN}?format=json`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data.Results || data.Results.length === 0) {
      return {
        make: '',
        model: '',
        year: '',
        bodyType: '',
        engine: '',
        transmission: '',
        fuelType: '',
        drivetrain: '',
        cabSize: '',
        error: 'No vehicle data found for this VIN'
      }
    }

    // Debug: Log all available fields to see what we're getting
    console.log('NHTSA API Response for VIN:', cleanVIN)
    data.Results.forEach((item: any) => {
      if (item.Variable && item.Value && item.Value !== '0' && item.Value !== 'null') {
        console.log(`${item.Variable}: ${item.Value}`)
      }
    })

    // Extract relevant information from NHTSA response
    const results = data.Results
    let vinData: VINData = {
      make: '',
      model: '',
      year: '',
      bodyType: '',
      engine: '',
      transmission: '',
      fuelType: '',
      drivetrain: '',
      cabSize: '',
      doors: 0,
    }

    // Variables to build engine description
    let displacementL = ''
    let engineConfig = ''
    let cylinders = ''
    let engineModel = ''

    results.forEach((item: any) => {
      if (item.Variable && item.Value && item.Value !== '0' && item.Value !== 'null') {
        switch (item.Variable) {
          case 'Make':
            vinData.make = item.Value
            break
          case 'Model':
            vinData.model = item.Value
            break
          case 'Model Year':
            vinData.year = item.Value
            break
          case 'Body Class':
            vinData.bodyType = mapBodyType(item.Value)
            break
          case 'Engine Model':
            engineModel = item.Value
            break
          case 'Displacement (L)':
            displacementL = item.Value
            break
          case 'Engine Configuration':
            engineConfig = item.Value
            break
          case 'Engine Number of Cylinders':
            cylinders = item.Value
            break
          case 'Transmission Style':
            vinData.transmission = mapTransmission(item.Value)
            break
          case 'Transmission Type':
            vinData.transmission = mapTransmission(item.Value)
            break
          case 'Transmission':
            vinData.transmission = mapTransmission(item.Value)
            break
          case 'Trans':
            vinData.transmission = mapTransmission(item.Value)
            break
          case 'Fuel Type - Primary':
            vinData.fuelType = mapFuelType(item.Value)
            break
          case 'Fuel Type':
            vinData.fuelType = mapFuelType(item.Value)
            break
          case 'Drive Type':
            vinData.drivetrain = mapDrivetrain(item.Value)
            break
          case 'Drive Train':
            vinData.drivetrain = mapDrivetrain(item.Value)
            break
          case 'Wheel Drive Type':
            vinData.drivetrain = mapDrivetrain(item.Value)
            break
          case 'Drive':
            vinData.drivetrain = mapDrivetrain(item.Value)
            break
          case 'Wheel Drive':
            vinData.drivetrain = mapDrivetrain(item.Value)
            break
          case 'Series':
            vinData.series = item.Value
            break
          case 'Trim':
            vinData.trim = item.Value
            break
          case 'Trim2':
            vinData.cabSize = mapCabSize(item.Value)
            break
          case 'Cab Type':
            if (!vinData.cabSize) {
              vinData.cabSize = mapCabSize(item.Value)
            }
            break
          case 'Doors':
            vinData.doors = parseInt(item.Value) || 0
            break
          case 'Vehicle Type':
            // Sometimes body type is in Vehicle Type field
            if (!vinData.bodyType) {
              vinData.bodyType = mapBodyType(item.Value)
            }
            break
          case 'Engine Configuration':
            // Additional engine info
            if (!engineConfig) {
              engineConfig = item.Value
            }
            break
          case 'Engine Model':
            // Alternative engine field
            if (!engineModel) {
              engineModel = item.Value
            }
            break
        }
      }
    })

    // Build engine description
    if (displacementL || engineConfig || cylinders) {
      vinData.engine = formatEngineDescription(displacementL, engineConfig, cylinders, engineModel)
    } else if (engineModel) {
      vinData.engine = engineModel
    }

    // Validate required fields
    if (!vinData.make || !vinData.model || !vinData.year) {
      return {
        make: '',
        model: '',
        year: '',
        bodyType: '',
        engine: '',
        transmission: '',
        fuelType: '',
        drivetrain: '',
        error: 'Incomplete vehicle data from VIN lookup'
      }
    }

    // Set defaults for missing fields
    if (!vinData.bodyType) vinData.bodyType = 'Other'
    if (!vinData.transmission) vinData.transmission = 'Unknown'
    if (!vinData.fuelType) vinData.fuelType = 'Other'
    if (!vinData.drivetrain) vinData.drivetrain = 'Unknown'

    console.log('Processed VIN Data:', vinData)

    return vinData
  } catch (error) {
    console.error('VIN lookup error:', error)
    return {
      make: '',
      model: '',
      year: '',
      bodyType: '',
      engine: '',
      transmission: '',
      fuelType: '',
      drivetrain: '',
      cabSize: '',
      error: 'Failed to lookup VIN. Please try again or enter details manually.'
    }
  }
}

// Helper functions to map NHTSA values to our format
function mapBodyType(nhtsaBodyType: string): string {
  const bodyTypeMap: { [key: string]: string } = {
    'Sedan': 'Sedan',
    'Sedan/Saloon': 'Sedan',
    'SUV': 'SUV',
    'Truck': 'Truck',
    'Van': 'Van',
    'Wagon': 'Wagon',
    'Coupe': 'Coupe',
    'Hatchback': 'Wagon',
    'Convertible': 'Coupe',
    'Pickup': 'Truck',
    'Minivan': 'Van',
    'Crossover': 'SUV',
    'Passenger Car': 'Sedan',
    'Multipurpose Passenger Vehicle (MPV)': 'SUV',
    'Motorcycle': 'Other',
    'Trailer': 'Other',
    'Low Speed Vehicle (LSV)': 'Other',
    'Bus': 'Other',
    'Incomplete Vehicle': 'Other'
  }
  
  return bodyTypeMap[nhtsaBodyType] || 'Other'
}

function mapTransmission(nhtsaTransmission: string): string {
  const transmissionMap: { [key: string]: string } = {
    'Automatic': 'Auto',
    'Manual': 'Manual',
    'CVT': 'Auto',
    'Semi-Automatic': 'Auto',
    'Automated Manual': 'Auto',
    'Direct Drive': 'Auto',
    'Electric': 'Auto',
    'AUTOMATIC': 'Auto',
    'MANUAL': 'Manual',
    'A/T': 'Auto',
    'M/T': 'Manual',
    'Continuously Variable': 'Auto',
    'Continuously Variable Transmission': 'Auto'
  }
  
  return transmissionMap[nhtsaTransmission] || 'Unknown'
}

function mapFuelType(nhtsaFuelType: string): string {
  const fuelTypeMap: { [key: string]: string } = {
    'Gasoline': 'Gas',
    'Diesel': 'Diesel',
    'Hybrid': 'Hybrid',
    'Electric': 'EV',
    'Plug-in Hybrid': 'Hybrid',
    'Flex Fuel': 'Gas',
    'Natural Gas': 'Other',
    'Propane': 'Other',
    'Hydrogen': 'Other',
    'Biodiesel': 'Diesel',
    'E85': 'Gas',
    'GASOLINE': 'Gas',
    'DIESEL': 'Diesel',
    'HYBRID': 'Hybrid',
    'ELECTRIC': 'EV'
  }
  
  return fuelTypeMap[nhtsaFuelType] || 'Other'
}

function mapDrivetrain(nhtsaDriveType: string): string {
  const input = nhtsaDriveType.toLowerCase()
  
  // Check for combined values first (like "4WD/4-Wheel Drive/4x4")
  if (input.includes('4wd') || input.includes('4x4') || input.includes('four-wheel') || input.includes('4-wheel')) {
    return '4WD'
  }
  if (input.includes('awd') || input.includes('all-wheel')) {
    return 'AWD'
  }
  if (input.includes('fwd') || input.includes('front-wheel')) {
    return 'FWD'
  }
  if (input.includes('rwd') || input.includes('rear-wheel') || input.includes('2wd') || input.includes('4x2')) {
    return 'RWD'
  }
  
  // Fallback to exact matches
  const drivetrainMap: { [key: string]: string } = {
    'FWD': 'FWD',
    'RWD': 'RWD',
    'AWD': 'AWD',
    '4WD': '4WD',
    '4x4': '4WD',
    '4x2': 'RWD',
    'Front-Wheel Drive': 'FWD',
    'Rear-Wheel Drive': 'RWD',
    'All-Wheel Drive': 'AWD',
    'Four-Wheel Drive': '4WD',
    '4X4': '4WD',
    '4X2': 'RWD',
    '2WD': 'RWD',
    'Part-time 4WD': '4WD',
    'Full-time 4WD': '4WD',
    'FRONT-WHEEL DRIVE': 'FWD',
    'REAR-WHEEL DRIVE': 'RWD',
    'ALL-WHEEL DRIVE': 'AWD',
    'FOUR-WHEEL DRIVE': '4WD',
    'Front Wheel Drive': 'FWD',
    'Rear Wheel Drive': 'RWD',
    'All Wheel Drive': 'AWD',
    'Four Wheel Drive': '4WD'
  }
  
  return drivetrainMap[nhtsaDriveType] || 'Unknown'
}

function mapCabSize(nhtsaCabSize: string): string {
  const input = nhtsaCabSize.toLowerCase()
  
  // Map common cab size patterns
  if (input.includes('double') || input.includes('extended')) {
    return 'Double Cab'
  }
  if (input.includes('single') || input.includes('regular')) {
    return 'Single Cab'
  }
  if (input.includes('crew') || input.includes('king')) {
    return 'Crew Cab'
  }
  if (input.includes('super') || input.includes('quad')) {
    return 'Super Cab'
  }
  if (input.includes('extra')) {
    return 'Extra Cab'
  }
  
  // Fallback to exact matches
  const cabSizeMap: { [key: string]: string } = {
    'Double Cab': 'Double Cab',
    'Single Cab': 'Single Cab',
    'Crew Cab': 'Crew Cab',
    'Super Cab': 'Super Cab',
    'Extra Cab': 'Extra Cab',
    'Regular Cab': 'Single Cab',
    'Extended Cab': 'Double Cab',
    'King Cab': 'Crew Cab',
    'Quad Cab': 'Super Cab'
  }
  
  return cabSizeMap[nhtsaCabSize] || nhtsaCabSize
}

// Helper to format engine description consistently like "3.5L V6"
function formatEngineDescription(displacementL: string, engineConfig: string, cylinders: string, fallbackModel: string): string {
  const cleanDisplacement = displacementL ? displacementL.trim() : ''
  const cfg = (engineConfig || '').toLowerCase()
  let layout = ''
  if (cfg.includes('v')) layout = 'V'
  else if (cfg.includes('inline') || cfg.includes('in-line') || cfg.includes('straight') || cfg === 'i') layout = 'I'
  else if (cfg.includes('flat') || cfg.includes('h') || cfg.includes('opposed') || cfg.includes('boxer')) layout = 'H'

  const cyl = cylinders ? String(cylinders).replace(/[^0-9]/g, '') : ''

  if (cleanDisplacement && layout && cyl) {
    return `${cleanDisplacement}L ${layout}${cyl}`
  }

  // Fallbacks
  if (cleanDisplacement && cyl) return `${cleanDisplacement}L ${cyl}-cyl`
  if (fallbackModel) return fallbackModel
  return ''
}
